var fSaccount = false;
var fSprovider = false;
var fStimeoutAmounts = false;
var fSunlocked = false;
var fSallowance = false;

var fStokenAddresses = [];
var fStokenDecimals = [];
var fStokenContract = false;

window.onload = function () {
    initializePresaleCountdown();
};

const initializePresaleCountdown = () => {
    const countDownDate = new Date("2021-11-15T00:00:00.0Z").getTime();
    const x = setInterval(function () {
        const now = new Date().getTime();
        const distance = countDownDate - now;

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById("presale-countdown").innerHTML = `<div class="countdown">
        <span>${days}<br/>Days</span>
        <span>${hours}<br/>Hours</span>
        <span>${minutes}<br/>Minutes</span>
        <span>${seconds}<br/>Seconds</span>
        </div>`

        if (distance < 0) {
            clearInterval(x);
            document.getElementById("presale-countdown").style.display = "none"
            document.getElementById("presale-button").style.display = "block"
        }
    }, 1000);
}



async function getAccount() {
    var accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    var account = false;

    if (accounts.length > 0) {
        fSaccount = accounts[0];

        account = fSaccount;
    }

    return account;
}

async function getProvider() {
    var provider = new ethers.providers.Web3Provider(window.ethereum);
    fSprovider = provider;

    var network = await provider.getNetwork();

    switch (network.chainId) {
        case 56:
            fStokenAddresses['bnb'] = '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c';
            fStokenAddresses['flokig'] = '0xa54c7fa856f0dfd5c1fac07bf4bab876663c42e3';
            break;
    }

    return provider;
}

async function getBalance(name) {
    var balance = 0;

    switch (name) {
        case 'bnb':
            balance = await fSprovider.getBalance(fSaccount);
            balance = ethers.utils.formatEther(balance);
            balance = parseFloat(balance).toFixed(7);
            break;

        case 'flokig':
            decimals = await fStokenContract.decimals();
            balance = await fStokenContract.balanceOf(fSaccount);
            balance = balance / Math.pow(10, decimals);
            fStokenDecimals[name] = decimals;
            break;
    }

    return balance;
}

async function updateAllowance() {
    var tokenFrom = jQuery('[x-text=tokenFrom]').text();
    console.log(tokenFrom);

    console.log('FSupdateAllowance');

    if (tokenFrom !== 'bnb') {
        fSallowance = await fStokenContract.methods.allowance(ethers.utils.getAddress(fSaccount), ethers.utils.getAddress(fSpancakeAddress)).call();

        console.log('Allowance: ' + fSallowance);

        if (fSallowance == 0) {
            console.log(jQuery('[x-text=tokenFromBalance]').text());
            if (jQuery('[x-text=tokenFromBalance]').text() == '0') {
                jQuery('.floki-swap-button').text('Insufficient balance');
            } else {
                jQuery('.floki-swap-button').text('Approve');
            }
        }
    } else {
        jQuery('.floki-swap-button').text('Swap');
        console.log('Skipping BNB allowance.');
    }
}

async function updateBalance(type) {
    if ((type == 'from') || (typeof (type) === 'undefined')) {
        var sourceBalance = await FSgetBalance(jQuery('[x-text=tokenFrom]').text())
        jQuery('[x-text=tokenFromBalance]').text(sourceBalance);
        this.tokenFromBalance = sourceBalance;
    }

    if ((type == 'to') || (typeof (type) === 'undefined')) {
        var destBalance = await FSgetBalance(jQuery('[x-text=tokenTo]').text())
        jQuery('[x-text=tokenToBalance]').text(destBalance);
        this.tokenToBalance = destBalance;
    }
}

async function approveToken() {
    var approved = await fStokenContract.approve(ethers.utils.getAddress(fSpancakeAddress), '1000000000000000000000000');

    console.log(approved);
}

const tokens = [
    { "id": "bnb", "address": "", "image": "https://flokigravity.com/wp-content/uploads/2021/10/bnb-1.png" },
    { "id": "flokig", "address": "", "image": "https://flokigravity.com/wp-content/uploads/2021/10/flokig.png" },
];

window.addEventListener('load', () => {
    tippy('[data-tippy-content]');
});

var urlParams = new URLSearchParams(window.location.search);
var develParam = urlParams.get('devel');


async function swapToken() {
    var tokenFrom = jQuery('[x-text=tokenFrom]').text();
    var tokenTo = jQuery('[x-text=tokenTo]').text();

    console.log(tokenFrom);
    console.log(tokenTo);

    var tokenFromAmount = jQuery('[x-model=tokenFromAmount]').val();
    var tokenToAmount = jQuery('[x-model=tokenToAmount]').val();

    console.log(tokenFromAmount);
    console.log(tokenToAmount);

    var tolerance = jQuery('[x-text=tolerance]').text();

    console.log(tolerance);

    var amountIn = 0;
    var amountOutMin = 0;

    if (tokenFrom == 'bnb') {
        amountIn = ethers.utils.parseEther(tokenFromAmount);
    } else {
        amountIn = tokenFromAmount * Math.pow(10, fStokenDecimals[tokenFrom]);
    }

    if (tokenTo == 'bnb') {
        amountOutMin = ethers.utils.parseEther(tokenToAmount);
    } else {
        console.log('trigger!');
        amountOutMin = tokenToAmount * Math.pow(10, fStokenDecimals[tokenTo]);
    }

    console.log(amountIn);
    console.log(amountOutMin);

    amountOutMin = parseInt(amountOutMin - (amountOutMin * (tolerance / 100)));
    amountOutMin = 1000000000000;

    console.log(amountOutMin);

    deadline = 20;

    var nowInSeconds = Math.floor(Date.now() / 1000);
    var expiryDate = nowInSeconds + (deadline * 60);

    console.log(expiryDate);

    var addressFrom = ethers.utils.getAddress(fStokenAddresses[tokenFrom]);
    var addressTo = ethers.utils.getAddress(fStokenAddresses[tokenTo]);
    var addressReceive = ethers.utils.getAddress(fSaccount);

    console.log(addressFrom);
    console.log(addressTo);
    console.log(addressReceive);

    if ((tokenFromAmount > 0) && (tokenToAmount > 0)) {
        console.log('proceed!');

        var tx = await fSpancakeContract.methods.swapExactETHForTokens(amountOutMin, [addressFrom, addressTo], addressReceive, deadline).send({ from: fSaccount, value: amountIn });

        console.log(tx);
    }
}

async function assign() {
    await getAccount();
    await getProvider();

    fStokenContract = new ethers.Contract(fStokenAddresses['flokig'], fStokenAbi, fSprovider);
    fSpancakeContract = new ethers.Contract(fSpancakeAddress, fSpancakeAbi, fSprovider);

    updateBalance();
}

async function initialize() {
    ethereum.on('accountsChanged', async function () {
        await assign();
    });

    await assign();

    if (!fStokenAddresses) {
        jQuery('.floki-swap-button').attr('disabled', 'disabled');
        jQuery('.floki-swap-button').text('FlokiSwap is only compatible with BSC');
    } else {
        jQuery('.floki-swap-button').text('Swap');
    }
}

//if (develParam == 'true') {
if (typeof ethereum === 'undefined') {
    jQuery('.floki-swap-button').attr('disabled', 'disabled');
    jQuery('.floki-swap-button').text('Please install a wallet');
} else {
    var script = document.createElement('script');
    script.src = 'https://cdn.ethers.io/lib/ethers-5.2.umd.min.js';
    document.head.appendChild(script);

    jQuery('[x-model=tokenFromAmount]').val(0);
    jQuery('[x-model=tokenToAmount]').val(0);
    jQuery('[x-model=tokenToAmount]').attr('readonly', 'readonly');
}
//}

document.addEventListener('alpine:init', () => {
    Alpine.data('mainState', () => ({
        state: 'main',
        tokenFrom: 'bnb',
        tokenFromAmount: '0.0',
        tokenFromBalance: 0,
        tokenTo: 'flokig',
        tokenToAmount: '0.0',
        tokenToBalance: 0,
        tolerance: 0.8,
        timeout: 20,

        init() {
            this.$watch('tokenFrom', value => this.onChanged('tokenFrom', value));
            this.$watch('tokenFromAmount', value => this.onChanged('tokenFromAmount', value));
            this.$watch('tokenTo', value => this.onChanged('tokenTo', value));
            this.$watch('tokenToAmount', value => this.onChanged('tokenToAmount', value));
            this.$watch('tolerance', value => this.onChanged('tolerance', value));
            this.$watch('timeout', value => this.onChanged('timeout', value));
        },

        onSwap() {
            [this.tokenFrom, this.tokenTo] = [this.tokenTo, this.tokenFrom];
            [this.tokenFromAmount, this.tokenToAmount] = [this.tokenToAmount, this.tokenFromAmount];
            [this.tokenFromBalance, this.tokenToBalance] = [this.tokenToBalance, this.tokenFromBalance];
        },

        onSelectToken(id) {
            if (id === this.searchDisabled) {
                return;
            }

            switch (this.searchMode) {
                case 'from':
                    this.tokenTo = id === this.tokenTo ? this.tokenFrom : this.tokenTo;
                    this.tokenFrom = id;
                    break;

                case 'to':
                    this.tokenFrom = id === this.tokenFrom ? this.tokenTo : this.tokenFrom;
                    this.tokenTo = id;
                    break;
            }

            this.state = 'main';
        },

        tokenImage(id) {
            const result = tokens
                .filter(token => token.id === id)
                .shift();

            return result ? result.image : '';
        },

        onChanged(property, value) {
            // P, this method exists as a placeholder in which you should implement any logic.
            console.log(`Property '${property}' value changed to '${value}'`);

            if (fSunlocked) {
                switch (property) {
                    case 'tokenFrom':
                        FSupdateBalance('from').then(function () {
                            FSupdateAllowance();
                        });
                        jQuery('[x-model=tokenFromAmount]').val(0);
                        jQuery('[x-model=tokenToAmount]').val(0);
                        break;

                    case 'tokenTo':
                        console.log(this.tokenTo);
                        FSupdateBalance('to').then(function () {
                            FSupdateAllowance();
                        });
                        jQuery('[x-model=tokenFromAmount]').val(0);
                        jQuery('[x-model=tokenToAmount]').val(0);
                        break;

                    case 'tokenFromAmount':
                        if (value > 0) {
                            if (value > parseFloat(jQuery('[x-text=tokenFromBalance]').text())) {
                                jQuery('.floki-swap-button').attr('disabled', 'disabled');
                                jQuery('.floki-swap-button').text('Insufficient balance');
                            } else {
                                if (jQuery('.floki-swap-button[disabled=disabled').length) {
                                    console.log('Trigger2!');
                                    jQuery('.floki-swap-button').removeAttr('disabled');
                                    jQuery('.floki-swap-button').text('Swap');
                                }

                                var amountIn = this.tokenFromAmount;
                                var tokenFrom = this.tokenFrom;
                                var tokenTo = this.tokenTo;

                                if (this.tokenFrom == 'bnb') {
                                    amountIn = ethers.utils.parseEther(amountIn);
                                } else {
                                    amountIn = amountIn * Math.pow(10, fStokenDecimals[this.tokenFrom]);
                                }

                                console.log(amountIn);

                                var addressFrom = ethers.utils.getAddress(fStokenAddresses[this.tokenFrom]);
                                var addressTo = ethers.utils.getAddress(fStokenAddresses[this.tokenTo]);

                                if (fStimeoutAmounts) {
                                    clearTimeout(fStimeoutAmounts);
                                }

                                if (amountIn > 0) {
                                    fStimeoutAmounts = setTimeout(async function () {
                                        amounts = await fSpancakeContract.getAmountsOut(amountIn, [addressFrom, addressTo]);
                                        console.log(amounts);

                                        var amountOut = 0;

                                        if (tokenTo != 'bnb') {
                                            amountOut = amounts[1] / Math.pow(10, decimals);
                                        } else {
                                            amountOut = ethers.utils.formatEther(amounts[1]);
                                            amountOut = parseFloat(amountOut).toFixed(14);
                                        }

                                        jQuery('[x-model=tokenToAmount]').val(amountOut);
                                    }, 500);
                                }
                            }
                        }
                        break;

                    case 'tokenToAmount':
                        // Todo
                        break;
                }
            }
        },

        onSubmit() {
            console.log('Form submitted');

            if (!fSunlocked) {
                if (typeof ethereum !== 'undefined') {
                    FSinitialize();
                    fSunlocked = true;
                    FSupdateAllowance();
                    jQuery('[x-model=tokenFromAmount]').val(0);
                    jQuery('[x-model=tokenToAmount]').val(0);
                }
            } else {
                var tokenFrom = jQuery('[x-text=tokenFrom]').text();

                console.log(fSallowance);

                if ((tokenFrom !== 'bnb') && (fSallowance == 0)) {
                    if (jQuery('[x-text=tokenFromBalance]').text() !== '0') {
                        FSapproveToken();
                        jQuery('.floki-swap-button').text('Swap');
                    } else {
                        console.log('Insufficient balance');
                    }
                } else {
                    console.log('swap!');
                    FSswapToken();
                }
            }
        },

        get tokenFromImage() {
            return 'url(' + this.tokenImage(this.tokenFrom) + ')';
        },

        get tokenToImage() {
            return 'url(' + this.tokenImage(this.tokenTo) + ')';
        },
    }));
});