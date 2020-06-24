App = {
    web3Provider: null,
    contracts: {},


    init: async function() {
        $.getJSON('../movieinfo.json', function(data) {

            // Borrow the html framework from pet-shop
            // Load info from json file to html

            var movieRow = $('#movieRow');
            var moviePanel = $('#moviePanel');

            for (i = 0; i < data.length; i ++) {
                moviePanel.find('.panel-title').text(data[i].name);
                moviePanel.find('img').attr('src', data[i].picture);
                moviePanel.find('.pet-breed').text(data[i].summary);
                moviePanel.find('.pet-age').text(data[i].rating);
                moviePanel.find('.pet-location').text(data[i].cast);
                moviePanel.find('.btn-adopt').attr('data-id', data[i].id);
                movieRow.append(moviePanel.html());
            }
        });
        App.render();
        return await App.initWeb3();
        },


    initWeb3: async function() {
        // Catch the instance from Ganache server
        if (typeof web3 !== 'undefined') {
            App.web3Provider = web3.currentProvider;
        } else {
            App.web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');
        }
        web3 = new Web3(App.web3Provider);
        return App.initContract();
        },


    render: function(){
        // Show the current user's account on html
         web3.eth.getCoinbase(function(err, account) {
            if (err === null) {
                App.account = account;
                $("#accountAddress").html("Your Account address: " + account);
            }
        });

    },

    initContract: function() {
        $.getJSON('Review.json', function(data) {
            // From the json file load the contract artifact
            var ReviewArtifact = data;
            App.contracts.Review = TruffleContract(ReviewArtifact);

            // Survice provider for  contract
            App.contracts.Review.setProvider(App.web3Provider);

            // Retrieve panel ID for movie that has already rated
            return App.markCommented();
        });
        // Bind to button click event
        return App.bindEvents();
        },

    // Button click event
    bindEvents: function() {
        $(document).on('click', '.btn-adopt', App.handleComment);
        },


    // Disable the panel button if the movie has already been rated
    markCommented: function(reviewers, account) {

        web3.eth.getCoinbase(function(err, account) {
            if (err === null) {
                App.account = account;
                console.log(account)
            }
        });

        var reviewInstance;
        App.contracts.Review.deployed().then(function(instance) {
            reviewInstance = instance;
            // return array reviewers
            // It's free to view info on blockchain
            return reviewInstance.getReviewers.call();

        }).then(function(reviewers) {
            for (i = 0; i < reviewers.length; i++) {
                // If reviewers[i] is not equal to initial value and also equal current account address
                // Disabled the  review function (select & text & button)
                if (reviewers[i] !== '0x0000000000000000000000000000000000000000' &&
                    reviewers[i] == App.account) {
                    $(".panel-pet").find('input').eq(i).attr('disabled', true);
                    $(".panel-pet").find('select').eq(i).css('background-color', '#ececec');
                    $(".panel-pet").find('select').eq(i).attr('disabled', true);
                    $('.panel-pet').eq(i).find('button').text('Success').attr('disabled', true);
                }
            }
        }).catch(function(err) {
            console.log(err.message);
        });
        },


    handleComment: function(event) {
        event.preventDefault();
        var panelButtonClicked = parseInt($(event.target).data('id'));
        var reviewInstance;

        // The same functionality as web3.eth.getCoinbase
        web3.eth.getAccounts(function(error, accounts) {
            if (error) {
                console.log(error);
            }
            var account = accounts[0];
            console.log('panel id of Button Clicked:', panelButtonClicked);
            App.contracts.Review.deployed().then(function(instance) {
                reviewInstance = instance;
                // Pass the value to contract
                return reviewInstance.review(panelButtonClicked, {from: account});
            }).then(function(result) {
                // Disabled the functionality of panel that has been reviewed
                return App.markCommented();
            }).catch(function(err) {
                console.log(err.message);
            });
        });
    }
};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
