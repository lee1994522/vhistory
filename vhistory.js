(function () {
    "use strict";
    var historyStack;
    var currentIndex = 0;
    var manualPop;
    var history = window.history;

    (function () {
        var wr = function (type) {
            var orig = history[type];
            return function () {
                var rv = orig.apply(this, arguments);
                var e = new Event(type.toLowerCase());
                e.arguments = arguments||{};
                e.action = type;
                window.dispatchEvent(e);
                return rv;
            };
        };
        history.pushState = wr('pushState');
        history.replaceState = wr('replaceState');
        history.go = wr('go');
        history.back = wr('back');
        history.forward = wr('forward');
    }());

    function getCurState() {
        return history.state?(history.state.state?history.state.state:history.state):{}
    }

    function Stack(pathName) {
        var state = getCurState();
        this.pathName = pathName;
        this.state = JSON.stringify(state)
    }

    function isStackEqual(stack) {
        return (stack.pathName === window.location.pathname && stack.state === JSON.stringify(getCurState()))
    }

    function getNewStack() {
        return new Stack(window.location.pathname)
    }

    function pushNewStack() {
        historyStack.push(getNewStack())
    }

    window.onload = function () {

        historyStack = [new Stack(window.location.pathname)];

        window.addEventListener('go', function (e) {
            manualPop = true;
            currentIndex = currentIndex + e.arguments[0]
        });

        window.addEventListener('back', function (e) {
            manualPop = true;
            currentIndex --
        });

        window.addEventListener('forward', function (e) {
            manualPop = true;
            currentIndex ++
        });

        window.addEventListener('pushstate', function (e) {
            if(currentIndex === historyStack.length - 1) {    //未经过回退操作
                pushNewStack();
                currentIndex ++
            } else {
                historyStack.splice(currentIndex + 1);
                pushNewStack();
                currentIndex ++
            }
        });

        window.addEventListener('popstate', function (e) {
            setTimeout(function () {     //使popstate慢于go、back、forward触发
                if(manualPop) {      //只处理浏览器自己触发的pop
                    manualPop = false;
                    return
                }
                //判断前进或是后退
                if(isStackEqual(historyStack[currentIndex-1])) {   //后退
                    currentIndex --
                } else if(isStackEqual(historyStack[currentIndex+1])) {   //前进
                    currentIndex ++
                }
            })
        });

        window.addEventListener('replacestate', function (e) {
            var path = window.location.pathname;
            if(historyStack && historyStack.length) {
                historyStack.splice(historyStack-1, 1, path)
            }else {
                historyStack = [new Stack(path)]
            }
        });
    };

    history.getStack = function () {
        var stack = [];
        historyStack.forEach(function (item) {
            stack.push(item.pathName)
        });
        return stack
    };

    history.backTo = function (path,nearEnd) {
        nearEnd = nearEnd == null ? true : nearEnd;
        var stack = history.getStack();
        var index = nearEnd ? stack.lastIndexOf(path) : stack.indexOf(path);
        if(index > -1 && index < currentIndex) {
            history.go(-(currentIndex-index))
        } else {
            console.error('Path does not exist')
        }
    };

    history.forwardTo = function (path,nearEnd) {
        nearEnd = nearEnd == null ? true : nearEnd;
        var stack = history.getStack();
        var index = nearEnd ? stack.indexOf(path) : stack.lastIndexOf(path);
        if(index > -1 && index > currentIndex) {
            history.go(index - currentIndex)
        } else {
            console.error('Path does not exist')
        }
    };

    history.getDistance = function (target,nearEnd) {
        nearEnd = nearEnd == null ? true : nearEnd;
        var stack = history.getStack();
        var index = nearEnd ? stack.lastIndexOf(target) : stack.indexOf(target);
        if(index > -1) {
            return (-(currentIndex-index))
        } else {
            console.error('Path does not exist')
        }
    }
}());