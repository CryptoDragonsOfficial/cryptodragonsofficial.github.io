const eggSpawnerAddress = '0x752cfa2c3e1753d1ae8209ed4d8f8fb5534033e8';
const usdcAddress = '0x2791bca1f2de4661ed88a30c99a7a9449aa84174'

let fSaccount = false;
let fSprovider = false;
let fSallowance = false;
let fPhase = false;
let fRareEggCount = false;
let fUncommonEggCount = false;
let fPresaleContract = false;
let fTokenContract = false;
let hiddenCountdown = false;

let web3Instance = new Web3X('https://rpc-mumbai.maticvigil.com/');
window.onload = async function () {
    var modal = document.getElementById("modal");
    var btn = document.getElementById("nftViewer");
    var span = document.getElementsByClassName("close")[0];
    btn.onclick = function () {
        modal.style.display = "block";
    }
    span.onclick = function () {
        modal.style.display = "none";
    }
    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
    initializePresaleCountdown();
    await initialize();
    checkTotalRareEgg();
    setInterval(function () {
        checkTotalRareEgg();
    }, 30000)
};

function SnackBar(userOptions) {
    var _This = this;
    var _Interval;
    var _Element;
    var _Container;
    var _Message;
    var _MessageWrapper;

    function _create() {
        _applyUserOptions();
        _setContainer();
        _applyPositionClasses();

        _Element = _createMessage();
        _Container.appendChild(_Element);

        if (_Options.timeout !== false && _Options.timeout > 0) {
            _Interval = setTimeout(_This.Close, _Options.timeout);
        }
    }

    function _applyUserOptions() {
        _Options = {
            message: userOptions?.message ?? "Operation performed successfully.",
            dismissible: userOptions?.dismissible ?? true,
            timeout: userOptions?.timeout ?? 5000,
            status: userOptions?.status ? userOptions.status.toLowerCase().trim() : "",
            actions: userOptions?.actions ?? [],
            fixed: userOptions?.fixed ?? false,
            position: userOptions?.position ?? "br",
            container: userOptions?.container ?? document.body,
            width: userOptions?.width,
            speed: userOptions?.speed,
            icon: userOptions?.icon
        };
    }

    function _setContainer() {
        var target = getOrFindContainer();

        if (target === undefined) {
            console.warn("SnackBar: Could not find target container " + _Options.container);
            target = document.body; // default to the body as the container
        }

        _Container = getOrAddContainerIn(target);

        function getOrAddContainerIn(target) {
            var node;
            var positionClass = _getPositionClass();

            for (var i = 0; i < target.children.length; i++) {
                node = target.children.item(i);

                if (node.nodeType === 1
                    && node.classList.length > 0
                    && node.classList.contains("js-snackbar-container")
                    && node.classList.contains(positionClass)
                ) {
                    return node;
                }
            }

            return createNewContainer(target);
        }

        function createNewContainer(target) {
            var container = document.createElement("div");
            container.classList.add("js-snackbar-container");

            if (_Options.fixed) {
                container.classList.add("js-snackbar-container--fixed");
            }

            target.appendChild(container);
            return container;
        }

        function getOrFindContainer() {
            return typeof _Options.container === "object"
                ? _Options.container
                : document.getElementById(_Options.container);
        }
    }

    function _applyPositionClasses() {
        _Container.classList.add(_getPositionClass());

        var fixedClassName = "js-snackbar-container--fixed";

        if (_Options.fixed) {
            _Container.classList.add(fixedClassName);
        }
        else {
            _Container.classList.remove(fixedClassName);
        }
    }

    function _createMessage() {
        var outerElement = createWrapper();

        var innerSnack = createInnerSnackbar();

        outerElement.appendChild(innerSnack);

        return outerElement;

        function createWrapper() {
            var outerElement = document.createElement("div");

            outerElement.classList.add("js-snackbar__wrapper");
            outerElement.style.height = "0px";
            outerElement.style.opacity = "0";
            outerElement.style.marginTop = "0px";
            outerElement.style.marginBottom = "0px";

            setWidth(outerElement);
            setSpeed(outerElement);

            return outerElement;
        }

        function createInnerSnackbar() {
            var innerSnack = document.createElement("div");
            innerSnack.classList.add("js-snackbar", "js-snackbar--show");

            applyColorAndIconTo(innerSnack);
            insertMessageTo(innerSnack);
            addActionsTo(innerSnack);
            addDismissButtonTo(innerSnack);

            return innerSnack;
        }

        function applyColorAndIconTo(element) {
            if (!_Options.status) return;

            var status = document.createElement("span");
            status.classList.add("js-snackbar__status");

            applyColorTo(status);
            applyIconTo(status);

            element.appendChild(status);

            function applyColorTo(element) {
                switch (_Options.status) {
                    case "success":
                    case "green":
                        element.classList.add("js-snackbar--success");
                        break;
                    case "warning":
                    case "alert":
                    case "orange":
                        element.classList.add("js-snackbar--warning");
                        break;
                    case "danger":
                    case "error":
                    case "red":
                        element.classList.add("js-snackbar--danger");
                        break;
                    default:
                        element.classList.add("js-snackbar--info");
                        break;
                }
            }

            function applyIconTo(element) {
                if (!_Options.icon) return;

                var icon = document.createElement("span");
                icon.classList.add("js-snackbar__icon");

                switch (_Options.icon) {
                    case "exclamation":
                    case "warn":
                    case "danger":
                        icon.innerText = "!";
                        break;
                    case "info":
                    case "question":
                    case "question-mark":
                        icon.innerText = "?";
                        break;
                    case "plus":
                    case "add":
                        icon.innerText = "+";
                        break;
                    default:
                        if (_Options.icon.length > 1) {
                            console.warn("Invalid icon character provided: ", _Options.icon);
                        }

                        icon.innerText = _Options.icon.substr(0, 1);
                        break;
                }

                element.appendChild(icon);
            }
        }

        function insertMessageTo(element) {
            _MessageWrapper = document.createElement("div");
            _MessageWrapper.classList.add("js-snackbar__message-wrapper");

            _Message = document.createElement("span");
            _Message.classList.add("js-snackbar__message")
            _Message.innerHTML = _Options.message;

            _MessageWrapper.appendChild(_Message);
            element.appendChild(_MessageWrapper);
        }

        function addActionsTo(element) {
            if (typeof _Options.actions !== "object") {
                return;
            }

            for (var i = 0; i < _Options.actions.length; i++) {
                addAction(element, _Options.actions[i]);
            }

            function addAction(element, action) {
                var button = document.createElement("span");
                button.classList.add("js-snackbar__action");
                button.textContent = action.text;

                if (typeof action.function === "function") {
                    if (action.dismiss === true) {
                        button.onclick = function () {
                            action.function();
                            _This.Close();
                        }
                    }
                    else {
                        button.onclick = action.function;
                    }
                }
                else {
                    button.onclick = _This.Close;
                }

                element.appendChild(button);
            }
        }

        function addDismissButtonTo(element) {
            if (!_Options.dismissible) {
                return;
            }

            var closeButton = document.createElement("span");
            closeButton.classList.add("js-snackbar__close");
            closeButton.innerText = "\u00D7";
            closeButton.onclick = _This.Close;

            element.appendChild(closeButton);
        }

        function setWidth(element) {
            if (!_Options.width) return;

            element.style.width = _Options.width;
        }

        function setSpeed(element) {
            const { speed } = _Options;

            switch (typeof speed) {
                case "number":
                    element.style.transitionDuration = speed + "ms";
                    break;
                case "string":
                    element.style.transitionDuration = speed;
                    break;
            }
        }
    }

    function _getPositionClass() {
        switch (_Options.position) {
            case "bl":
                return "js-snackbar-container--bottom-left";
            case "tl":
                return "js-snackbar-container--top-left";
            case "tr":
                return "js-snackbar-container--top-right";
            case "tc":
            case "tm":
                return "js-snackbar-container--top-center";
            case "bc":
            case "bm":
                return "js-snackbar-container--bottom-center";
            default:
                return "js-snackbar-container--bottom-right";
        }
    }

    this.Open = function () {
        var contentHeight = getMessageHeight();

        _Element.style.height = contentHeight + "px";
        _Element.style.opacity = 1;
        _Element.style.marginTop = "5px";
        _Element.style.marginBottom = "5px";

        _Element.addEventListener("transitioned", function () {
            _Element.removeEventListener("transitioned", arguments.callee);
            _Element.style.height = null;
        })

        function getMessageHeight() {
            const wrapperStyles = window.getComputedStyle(_MessageWrapper)

            return _Message.scrollHeight
                + parseFloat(wrapperStyles.getPropertyValue('padding-top'))
                + parseFloat(wrapperStyles.getPropertyValue("padding-bottom"))
        }
    }

    this.Close = function () {
        if (_Interval)
            clearInterval(_Interval);

        var snackbarHeight = _Element.scrollHeight; // get the auto height as a px value
        var snackbarTransitions = _Element.style.transition;
        _Element.style.transition = "";

        requestAnimationFrame(function () {
            _Element.style.height = snackbarHeight + "px"; // set the auto height to the px height
            _Element.style.opacity = 1;
            _Element.style.marginTop = "0px";
            _Element.style.marginBottom = "0px";
            _Element.style.transition = snackbarTransitions

            requestAnimationFrame(function () {
                _Element.style.height = "0px";
                _Element.style.opacity = 0;
            })
        });

        setTimeout(function () {
            _Container.removeChild(_Element);
        }, 1000);
    };

    _create();
    _This.Open();
}

const initializePresaleCountdown = () => {
    var ringer = {
        countdown_to: "2021-11-15T00:00:00.0Z",
        rings: {
            'DAYS': {
                s: 86400000, // mseconds in a day,
                max: 10
            },
            'HOURS': {
                s: 3600000, // mseconds per hour,
                max: 24
            },
            'MINUTES': {
                s: 60000, // mseconds per minute
                max: 60
            },
            'SECONDS': {
                s: 1000,
                max: 60
            },
        },
        r_count: 3,
        r_spacing: 30, // px
        r_size: 100, // px
        r_thickness: 2, // px
        update_interval: 11, // ms


        init: function () {

            $r = ringer;
            $r.cvs = document.createElement('canvas');

            $r.size = {
                w: ($r.r_size + $r.r_thickness) * $r.r_count + ($r.r_spacing * ($r.r_count - 1)),
                h: ($r.r_size + $r.r_thickness)
            };



            $r.cvs.setAttribute('width', $r.size.w);
            $r.cvs.setAttribute('height', $r.size.h);
            $r.ctx = $r.cvs.getContext('2d');
            const counter = document.getElementById("presale-countdown");
            $(counter).append($r.cvs);
            $r.cvs = $($r.cvs);
            $r.ctx.textAlign = 'center';
            $r.actual_size = $r.r_size + $r.r_thickness;
            $r.countdown_to_time = new Date($r.countdown_to).getTime();
            $r.cvs.css({ width: $r.size.w + "px", height: $r.size.h + "px" });
            $r.go();
        },
        ctx: null,
        go: function () {
            var idx = 0;

            $r.time = (new Date().getTime()) - $r.countdown_to_time;
            if ($r.time > 0 && !hiddenCountdown) {
                hiddenCountdown = true;
                const counter = document.getElementById("presale-countdown");
                const nftViewer = document.getElementById("nftViewer");
                nftViewer.style.display = 'block';
                counter.style.display = 'none';
            }


            for (var r_key in $r.rings) $r.unit(idx++, r_key, $r.rings[r_key]);

            setTimeout($r.go, $r.update_interval);
        },
        unit: function (idx, label, ring) {
            var x, y, value, ring_secs = ring.s;
            value = parseFloat($r.time / ring_secs);
            $r.time -= Math.round(parseInt(value)) * ring_secs;
            value = Math.abs(value);

            x = ($r.r_size * .5 + $r.r_thickness * .5);
            x += +(idx * ($r.r_size + $r.r_spacing + $r.r_thickness));
            y = $r.r_size * .5;
            y += $r.r_thickness * .5;


            // calculate arc end angle
            var degrees = 360 - (value / ring.max) * 360.0;
            var endAngle = degrees * (Math.PI / 180);

            $r.ctx.save();

            $r.ctx.translate(x, y);
            $r.ctx.clearRect($r.actual_size * -0.5, $r.actual_size * -0.5, $r.actual_size, $r.actual_size);

            // first circle
            $r.ctx.strokeStyle = "rgba(128,128,128,0.2)";
            $r.ctx.beginPath();
            $r.ctx.arc(0, 0, $r.r_size / 2, 0, 2 * Math.PI, 2);
            $r.ctx.lineWidth = $r.r_thickness;
            $r.ctx.stroke();

            // second circle
            $r.ctx.strokeStyle = "rgba(253, 128, 1, 0.9)";
            $r.ctx.beginPath();
            $r.ctx.arc(0, 0, $r.r_size / 2, 0, endAngle, 1);
            $r.ctx.lineWidth = $r.r_thickness;
            $r.ctx.stroke();

            // label
            $r.ctx.fillStyle = "#ffffff";

            $r.ctx.font = '12px Helvetica';
            $r.ctx.fillText(label, 0, 23);
            $r.ctx.fillText(label, 0, 23);

            $r.ctx.font = 'bold 40px Helvetica';
            $r.ctx.fillText(Math.floor(value), 0, 10);

            $r.ctx.restore();
        }
    }

    ringer.init();
}

async function connectWallet() {
    if (typeof ethereum === 'undefined') {
        jQuery('#presale-button').attr('disabled', 'disabled');
        jQuery('#presale-button').text('Please install a wallet');
    }

    ethereum.on('accountsChanged', async function () {
        await assign();
    });

    await assign();

    const provider = web3.currentProvider;
    fSprovider = provider;
    web3Instance.setProvider(provider);

    const chainId = await provider.chainId;

    if (chainId != '0x89') {
        jQuery('#presale-button').attr('disabled', 'disabled');
        jQuery('#presale-button').text('Wrong Network');
    }

    const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    let account = false;

    if (accounts.length > 0) {
        fSaccount = accounts[0];

        account = fSaccount;

        await readPhase();
        await checkRareEgg();
        await checkUncommonEgg();
        await updateAllowance();
    } else {
        jQuery('#presale-button').removeAttr('disabled');
        jQuery('#presale-button').text('Connect Wallet');
    }

    return account;
}

async function getBalance() {
    var balance = 0;
    decimals = await fTokenContract.methods.decimals().call();
    balance = await fTokenContract.methods.balanceOf(fSaccount).call();
    balance = balance / Math.pow(10, decimals);

    return balance;
}

async function updateAllowance(approved = false) {
    fSallowance = await fTokenContract.methods.allowance(fSaccount, eggSpawnerAddress).call();

    if (approved) {
        await setBuyAttributes();
        return;
    }

    if (fSallowance == 0) {
        jQuery('#presale-button').removeAttr('disabled');
        jQuery('#presale-button').text('Approve');
        jQuery('#presale-button').click(approveToken);
    } else {
        await setBuyAttributes();
    }
}

async function setBuyAttributes() {
    const fUsdcBalance = await getBalance();
    await readPhase();
    await checkRareEgg();
    await checkUncommonEgg();
    if (fUsdcBalance < 50) {
        jQuery('#presale-button').attr('disabled', 'disabled');
        jQuery('#presale-button').text('Insufficient Balance');
        return;
    }

    switch (fPhase) {
        case "0":
            jQuery('#presale-button').attr('disabled', 'disabled');
            jQuery('#presale-button').text('Presale Not Started');
            break;
        case "1":
            if (fRareEggCount != 0) {
                jQuery('#presale-button').attr('disabled', 'disabled');
                jQuery('#presale-button').text('Already Participated');
                break;
            }
            jQuery('#presale-button').removeAttr('disabled');
            jQuery('#presale-button').text('Buy Egg');
            jQuery('#presale-button').click(buyEgg);
            break;
        case "2":
            if (fUncommonEggCount != 0) {
                jQuery('#presale-button').attr('disabled', 'disabled');
                jQuery('#presale-button').text('Already Participated');
                break;
            }
            jQuery('#presale-button').removeAttr('disabled');
            jQuery('#presale-button').text('Buy Egg');
            jQuery('#presale-button').click(buyEgg);
            break;
        default:
            jQuery('#presale-button').attr('disabled', 'disabled');
            jQuery('#presale-button').text('Presale Finished');
            break;
    }
}

async function approveToken() {
    const approval = await fTokenContract.methods.approve(eggSpawnerAddress, '1000000000000000000000000').send({ from: fSaccount })
        .on('transactionHash', function (hash) {
            new SnackBar({
                message: hash ? `Transaction Send` : 'Declined',
                dismissible: true,
                status: hash ? "green" : "red",
                timeout: 3000,
            });
        });
    new SnackBar({
        message: approval ? 'Approved' : 'Declined',
        dismissible: true,
        status: approval ? "green" : "red",
        timeout: 3000,
    });
    await updateAllowance(approval);
}

async function readPhase() {
    fPhase = await fPresaleContract.methods.phase().call();
}

async function checkRareEgg() {
    fRareEggCount = await fPresaleContract.methods.rareEggs(fSaccount).call();
}

async function checkUncommonEgg() {
    fUncommonEggCount = await fPresaleContract.methods.uncommonEggs(fSaccount).call();
}

async function checkTotalRareEgg() {
    const rareCount = await fPresaleContract.methods.rareEggCount().call();
    jQuery('#rare-counter').text(`Rare Eggs sold: ${rareCount}`);
}

async function checkTotalUncommonEgg() {
    const uncommonCount = await fPresaleContract.methods.uncommonEggCount().call();
    //Implement on Phase 2
}

async function buyEgg() {
    var result = await fPresaleContract.methods.spawnEgg().send({ from: fSaccount, gasPrice: '40000000000' })
        .on('transactionHash', function (hash) {
            new SnackBar({
                message: hash ? `Transaction Send` : 'Declined',
                dismissible: true,
                status: hash ? "green" : "red",
                timeout: 3000,
            });
        });
    new SnackBar({
        message: result ? 'Purchase Confirmed' : 'Declined',
        dismissible: true,
        status: result ? "green" : "red",
        timeout: 3000,
    });
    if (result) {
        await setBuyAttributes();
    }
}

async function assign() {
    fPresaleContract = new web3Instance.eth.Contract(abi, eggSpawnerAddress);
    fTokenContract = new web3Instance.eth.Contract(tokenAbi, usdcAddress);
}

async function initialize() {
    await connectWallet();
}


const abi = [
    {
        "inputs": [
            {
                "internalType": "contract IINft",
                "name": "iNft_",
                "type": "address"
            },
            {
                "internalType": "contract IERC20",
                "name": "usdc_",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "teamWallet_",
                "type": "address"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "previousOwner",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "newOwner",
                "type": "address"
            }
        ],
        "name": "OwnershipTransferred",
        "type": "event"
    },
    {
        "inputs": [],
        "name": "advancePhase",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "card0RareToToken",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "token_",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "card1UncommonToToken",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "token_",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "owner",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "phase",
        "outputs": [
            {
                "internalType": "enum EggSpawner.Phase",
                "name": "",
                "type": "uint8"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "rareEggCount",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "rareEggs",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "rate",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "renounceOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "rate_",
                "type": "uint256"
            }
        ],
        "name": "setRate",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "teamWallet_",
                "type": "address"
            }
        ],
        "name": "setTeamWallet",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "spawnEgg",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "teamWallet",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "token_",
                "type": "uint256"
            }
        ],
        "name": "tokenToStats",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "id_",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "chain_",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "fungibility_",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "type_",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "version_",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "card_",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "magic_",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "wallet_",
                "type": "uint256"
            }
        ],
        "stateMutability": "pure",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "newOwner",
                "type": "address"
            }
        ],
        "name": "transferOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "uncommonEggCount",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "uncommonEggs",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
];

const tokenAbi = [{ "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "owner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "spender", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "Approval", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "authorizer", "type": "address" }, { "indexed": true, "internalType": "bytes32", "name": "nonce", "type": "bytes32" }], "name": "AuthorizationCanceled", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "authorizer", "type": "address" }, { "indexed": true, "internalType": "bytes32", "name": "nonce", "type": "bytes32" }], "name": "AuthorizationUsed", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "account", "type": "address" }], "name": "Blacklisted", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "address", "name": "userAddress", "type": "address" }, { "indexed": false, "internalType": "address payable", "name": "relayerAddress", "type": "address" }, { "indexed": false, "internalType": "bytes", "name": "functionSignature", "type": "bytes" }], "name": "MetaTransactionExecuted", "type": "event" }, { "anonymous": false, "inputs": [], "name": "Pause", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "newRescuer", "type": "address" }], "name": "RescuerChanged", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "bytes32", "name": "role", "type": "bytes32" }, { "indexed": true, "internalType": "bytes32", "name": "previousAdminRole", "type": "bytes32" }, { "indexed": true, "internalType": "bytes32", "name": "newAdminRole", "type": "bytes32" }], "name": "RoleAdminChanged", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "bytes32", "name": "role", "type": "bytes32" }, { "indexed": true, "internalType": "address", "name": "account", "type": "address" }, { "indexed": true, "internalType": "address", "name": "sender", "type": "address" }], "name": "RoleGranted", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "bytes32", "name": "role", "type": "bytes32" }, { "indexed": true, "internalType": "address", "name": "account", "type": "address" }, { "indexed": true, "internalType": "address", "name": "sender", "type": "address" }], "name": "RoleRevoked", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": true, "internalType": "address", "name": "to", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "Transfer", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "account", "type": "address" }], "name": "UnBlacklisted", "type": "event" }, { "anonymous": false, "inputs": [], "name": "Unpause", "type": "event" }, { "inputs": [], "name": "APPROVE_WITH_AUTHORIZATION_TYPEHASH", "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "BLACKLISTER_ROLE", "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "CANCEL_AUTHORIZATION_TYPEHASH", "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "DECREASE_ALLOWANCE_WITH_AUTHORIZATION_TYPEHASH", "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "DEFAULT_ADMIN_ROLE", "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "DEPOSITOR_ROLE", "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "DOMAIN_SEPARATOR", "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "EIP712_VERSION", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "INCREASE_ALLOWANCE_WITH_AUTHORIZATION_TYPEHASH", "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "META_TRANSACTION_TYPEHASH", "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "PAUSER_ROLE", "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "PERMIT_TYPEHASH", "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "RESCUER_ROLE", "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "TRANSFER_WITH_AUTHORIZATION_TYPEHASH", "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "WITHDRAW_WITH_AUTHORIZATION_TYPEHASH", "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "address", "name": "spender", "type": "address" }], "name": "allowance", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "approve", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "value", "type": "uint256" }, { "internalType": "uint256", "name": "validAfter", "type": "uint256" }, { "internalType": "uint256", "name": "validBefore", "type": "uint256" }, { "internalType": "bytes32", "name": "nonce", "type": "bytes32" }, { "internalType": "uint8", "name": "v", "type": "uint8" }, { "internalType": "bytes32", "name": "r", "type": "bytes32" }, { "internalType": "bytes32", "name": "s", "type": "bytes32" }], "name": "approveWithAuthorization", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "authorizer", "type": "address" }, { "internalType": "bytes32", "name": "nonce", "type": "bytes32" }], "name": "authorizationState", "outputs": [{ "internalType": "enum GasAbstraction.AuthorizationState", "name": "", "type": "uint8" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }], "name": "balanceOf", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }], "name": "blacklist", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "blacklisters", "outputs": [{ "internalType": "address[]", "name": "", "type": "address[]" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "authorizer", "type": "address" }, { "internalType": "bytes32", "name": "nonce", "type": "bytes32" }, { "internalType": "uint8", "name": "v", "type": "uint8" }, { "internalType": "bytes32", "name": "r", "type": "bytes32" }, { "internalType": "bytes32", "name": "s", "type": "bytes32" }], "name": "cancelAuthorization", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "decimals", "outputs": [{ "internalType": "uint8", "name": "", "type": "uint8" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "subtractedValue", "type": "uint256" }], "name": "decreaseAllowance", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "decrement", "type": "uint256" }, { "internalType": "uint256", "name": "validAfter", "type": "uint256" }, { "internalType": "uint256", "name": "validBefore", "type": "uint256" }, { "internalType": "bytes32", "name": "nonce", "type": "bytes32" }, { "internalType": "uint8", "name": "v", "type": "uint8" }, { "internalType": "bytes32", "name": "r", "type": "bytes32" }, { "internalType": "bytes32", "name": "s", "type": "bytes32" }], "name": "decreaseAllowanceWithAuthorization", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "user", "type": "address" }, { "internalType": "bytes", "name": "depositData", "type": "bytes" }], "name": "deposit", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name"
: "userAddress", "type": "address" }, { "internalType": "bytes", "name": "functionSignature", "type": "bytes" }, { "internalType": "bytes32", "name": "sigR", "type": "bytes32" }, { "internalType": "bytes32", "name": "sigS", "type": "bytes32" }, { "internalType": "uint8", "name": "sigV", "type": "uint8" }], "name": "executeMetaTransaction", "outputs": [{ "internalType": "bytes", "name": "", "type": "bytes" }], "stateMutability": "payable", "type": "function" }, { "inputs": [{ "internalType": "bytes32", "name": "role", "type": "bytes32" }], "name": "getRoleAdmin", "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "bytes32", "name": "role", "type": "bytes32" }, { "internalType": "uint256", "name": "index", "type": "uint256" }], "name": "getRoleMember", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "bytes32", "name": "role", "type": "bytes32" }], "name": "getRoleMemberCount", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "bytes32", "name": "role", "type": "bytes32" }, { "internalType": "address", "name": "account", "type": "address" }], "name": "grantRole", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "bytes32", "name": "role", "type": "bytes32" }, { "internalType": "address", "name": "account", "type": "address" }], "name": "hasRole", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "addedValue", "type": "uint256" }], "name": "increaseAllowance", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "increment", "type": "uint256" }, { "internalType": "uint256", "name": "validAfter", "type": "uint256" }, { "internalType": "uint256", "name": "validBefore", "type": "uint256" }, { "internalType": "bytes32", "name": "nonce", "type": "bytes32" }, { "internalType": "uint8", "name": "v", "type": "uint8" }, { "internalType": "bytes32", "name": "r", "type": "bytes32" }, { "internalType": "bytes32", "name": "s", "type": "bytes32" }], "name": "increaseAllowanceWithAuthorization", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "string", "name": "newName", "type": "string" }, { "internalType": "string", "name": "newSymbol", "type": "string" }, { "internalType": "uint8", "name": "newDecimals", "type": "uint8" }, { "internalType": "address", "name": "childChainManager", "type": "address" }], "name": "initialize", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "initialized", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }], "name": "isBlacklisted", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "name", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }], "name": "nonces", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "pause", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "paused", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "pausers", "outputs": [{ "internalType": "address[]", "name": "", "type": "address[]" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "value", "type": "uint256" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }, { "internalType": "uint8", "name": "v", "type": "uint8" }, { "internalType": "bytes32", "name": "r", "type": "bytes32" }, { "internalType": "bytes32", "name": "s", "type": "bytes32" }], "name": "permit", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "bytes32", "name": "role", "type": "bytes32" }, { "internalType": "address", "name": "account", "type": "address" }], "name": "renounceRole", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "contract IERC20", "name": "tokenContract", "type": "address" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "rescueERC20", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "rescuers", "outputs": [{ "internalType": "address[]", "name": "", "type": "address[]" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "bytes32", "name": "role", "type": "bytes32" }, { "internalType": "address", "name": "account", "type": "address" }], "name": "revokeRole", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "symbol", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "totalSupply", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "recipient", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "transfer", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "sender", "type": "address" }, { "internalType": "address", "name": "recipient", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "transferFrom", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "from", "type": "address" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "value", "type": "uint256" }, { "internalType": "uint256", "name": "validAfter", "type": "uint256" }, { "internalType": "uint256", "name": "validBefore", "type": "uint256" }, { "internalType": "bytes32", "name": "nonce", "type": "bytes32" }, { "internalType": "uint8", "name": "v", "type": "uint8" }, { "internalType": "bytes32", "name": "r", "type": "bytes32" }, { "internalType": "bytes32", "name": "s", "type": "bytes32" }], "name": "transferWithAuthorization", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }], "name": "unBlacklist", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "unpause", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "string", "name": "newName", "type": "string" }, { "internalType": "string", "name": "newSymbol", "type": "string" }], "name": "updateMetadata", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "withdraw", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "uint256", "name": "value", "type": "uint256" }, { "internalType": "uint256", "name": "validAfter", "type": "uint256" }, { "internalType": "uint256", "name": "validBefore", "type": "uint256" }, { "internalType": "bytes32", "name": "nonce", "type": "bytes32" }, { "internalType": "uint8", "name": "v", "type": "uint8" }, { "internalType": "bytes32", "name": "r", "type": "bytes32" }, { "internalType": "bytes32", "name": "s", "type": "bytes32" }], "name": "withdrawWithAuthorization", "outputs": [], "stateMutability": "nonpayable", "type": "function" }]

