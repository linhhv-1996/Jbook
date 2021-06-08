import './code-editor.css';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import Editor, { Monaco } from "@monaco-editor/react";
import prettire from 'prettier';
import parser from 'prettier/parser-babel';
import { useRef } from 'react';

import codeShift from 'jscodeshift';
import Highlighter from 'monaco-jsx-highlighter';

interface EditorProp {
    initialValue: string,
    onChangeText(input: string): void
}

const CodeEditor: React.FC<EditorProp> = ({ onChangeText, initialValue }) => {
    const editorRef = useRef<any>(null);

    const onDidMount = (editor: monaco.editor.IStandaloneCodeEditor, monacoEditor: Monaco) => {
        editorRef.current = editor;

        const highlighter = new Highlighter(
            // @ts-ignore
            window.monaco,
            codeShift,
            editor
        );
        highlighter.highLightOnDidChangeModelContent(
            () => {},
            () => {},
            undefined,
            () => {}
        );
    }

    const onChange = (value: string | undefined, ev: monaco.editor.IModelContentChangedEvent) => {
        onChangeText(value || '');
    }

    const formatCode = () => {
        const unformated = editorRef.current?.getValue();
        const formated = prettire.format(unformated, {
            parser: 'babel',
            plugins: [parser],
            useTabs: true,
            semi: true,
            singleQuote: true,
        });
        editorRef.current.setValue(formated);
    }

    return ( 
    <div className="editor-wrapper">
        <button className="button button-format is-primary is-small" onClick={formatCode}>Format</button>
        <Editor
            onMount={onDidMount}
            onChange={onChange}
            value={initialValue}
            theme="vs-dark" 
            language="javascript" 
            height="100%" 
            options={{
                wordWrap: 'on',
                showUnused: false,
                folding: false,
                lineNumbersMinChars: 3,
                fontSize: 13,
                fontFamily: 'Consolas',
                scrollBeyondLastLine: false,
                automaticLayout: true,
            }}/> 
    </div>);
}

export default CodeEditor;