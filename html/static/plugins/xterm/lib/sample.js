
function createTerminate(target, onKey){

    let term ;
    term = new Terminal({
        rendererType: "canvas", //渲染类型
        convertEol: true, //启用时，光标将设置为下一行的开头
        scrollback: 100, //终端中的回滚量
        disableStdin: false, //是否应禁用输入。
        cursorStyle: "underline", //光标样式
        cursorBlink: true, //光标闪烁
        theme: {
            foreground: "#7e9192", //字体
            background: "#002833", //背景色
            cursor: "help", //设置光标
            lineHeight: 16
        },
        bellStyle:'sound',
        rightClickSelectsWord:true,
        screenReaderMode:true,
        allowProposedApi: true,
        LogLevel: 'debug',
        tabStopWidth: 4,
    });

    let curr_line = '';

    term.onKey((event) => {
        if(onKey){
            onKey.call(term, event.key, event.domEvent)
        }
    });

    term.open(target);

    //term.open(document.getElementById('container-terminal'));
    term.writeln('Welcome to docker-web-console');
    term.writeln('This is a local terminal emulation, without a real terminal in the back-end.');
    term.writeln('Type some keys and commands to play around.');

    term.focus()

    return term
}

function createTerminate2(target, onData, onKey, width){

    let term ;
    term = new Terminal({
        rendererType: "canvas", //渲染类型
        convertEol: true, //启用时，光标将设置为下一行的开头
        //   scrollback: 50, //终端中的回滚量
        disableStdin: false, //是否应禁用输入。
        cursorStyle: "underline", //光标样式
        width:width,
        cursorBlink: true, //光标闪烁
        theme: {
            foreground: "#7e9192", //字体
            background: "#002833", //背景色
            cursor: "help", //设置光标
            lineHeight: 16
        },
        bellStyle:'sound',
        rightClickSelectsWord:true,
        screenReaderMode:true,
        allowProposedApi: true,
        LogLevel: 'debug',
        tabStopWidth: 4,
    });

    term.prompt = () => {
        term.write("\r\n$ ");
    };

    let curr_line = '';

    term.onKey((event) => {
        key = event.key;
        ev = event.domEvent;

        // if(onKey){
        //     onKey.call(term, key, event);
        // }

        if (key.charCodeAt(0) == 13){
            term.write('\n');
            if(onData){
                onData.call(term, curr_line+'\n')
            }

            curr_line = '';
            return ;
        }

        if(ev.ctrlKey==true)
        {
            if(onKey){
                onKey.call(term, key, event);
                return ;
            }
        }

        if(ev.keyCode==37||ev.keyCode==38||ev.keyCode==39||ev.keyCode==40) {
            ev.preventDefault();
            return ;
        }

        if (ev.keyCode === 8) {
            // Do not delete the prompt
            if (term._core.buffer.x > 2) {
                curr_line = curr_line.slice(0, -1);
                term.write('\b \b');
                return;
            }
        }

        curr_line += ev.key;

        if(onKey){
            onKey.call(term, key, event);
            return ;
        }
    });

    term.open(target);

    //term.open(document.getElementById('container-terminal'));
    term.writeln('Welcome to docker-web-console');
    term.writeln('This is a local terminal emulation, without a real terminal in the back-end.');
    term.write('Type some keys and commands to play around.');
    term.prompt();

    return term
}