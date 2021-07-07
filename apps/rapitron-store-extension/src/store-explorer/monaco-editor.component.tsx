import * as monaco from 'monaco-editor';
import React from 'react';
import { createRef, PureComponent } from 'react';

export class MonacoEditor extends PureComponent<{ value: string, onChange?: (value: string) => void }> {

    private readonly containerRef = createRef<HTMLDivElement>();

    public editor: monaco.editor.IStandaloneCodeEditor;
    public value = monaco.editor.createModel('');

    public componentDidMount() {
        this.editor = monaco.editor.create(this.containerRef.current, {
            automaticLayout: true,
            theme: 'vs-dark'
        });
        this.value = monaco.editor.createModel(this.props.value);
        this.editor.setModel(this.value);
        this.value.onDidChangeContent(() => this.props.onChange && this.props.onChange(this.value.getValue()));
    }

    public componentDidUpdate() {
        this.value.setValue(this.props.value);
    }

    public render() {
        return (
            <div
                ref={this.containerRef}
                style={{
                    height: '100%',
                    overflow: 'hidden'
                }}
            />
        );
    }

}

export class MonacoDiffEditor extends PureComponent<{ original: string, value: string }> {

    private readonly containerRef = createRef<HTMLDivElement>();

    public editor: monaco.editor.IStandaloneDiffEditor;
    public original = monaco.editor.createModel('');
    public value = monaco.editor.createModel('');

    public componentDidMount() {
        this.editor = monaco.editor.createDiffEditor(this.containerRef.current, {
            automaticLayout: true,
            theme: 'vs-dark'
        });
        this.original = monaco.editor.createModel(this.props.original);
        this.value = monaco.editor.createModel(this.props.value);
        this.editor.setModel({
            original: this.original,
            modified: this.value
        });
    }

    public componentDidUpdate() {
        this.original.setValue(this.props.original);
        this.value.setValue(this.props.value);
    }

    public render() {
        return (
            <div
                ref={this.containerRef}
                style={{
                    height: '100%',
                    overflow: 'hidden'
                }}
            />
        );
    }

}