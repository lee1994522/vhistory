## Vhistory.js
Vhistory.js extends HTML5 History's API with a manually maintained stack of the history.It allows you to read and operate the history stack directly.
## Usage
```javascript
<script src="/vhistory/index.js"></script>
```

## API
###history.getStack()
history.getStacks returns the current stack of your history

```javascript
var stack = history.getStack();

console.log(stack)
//['/APage','/BPage','CPage']
});
```

###history.backTo(target:string,nearEnd:boolean)
history.backTo receives two arguments,the first arg is the target path you want to go back,the second arg decides whether the target is at the near-end or the far-end(if you have entered the target page twice or more),default is true.

```javascript
history.backTo('/APage')
```


###history.forwardTo(target:string,nearEnd:boolean)
The same usage but the opposite direction as history.backTo

###history.getDistance(target:path,nearEnd:boolean)
history.getDistance will return the distance between the target path and your current path.
The default value of nearEnd is true

```javascript
//if your history stack is ['/APage','/BPage','/APage','/CPage','/DPage']
//and the current path is CPage

console.log(history.getDistance('/APage'));  //-1

console.log(history.getDistance('/APage',false))  //-3

console.log(history.getDistance('/DPage') //1

```