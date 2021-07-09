import * as monaco from 'monaco-editor';
import React, { createRef, PureComponent } from 'react';

export class MonacoEditor extends PureComponent<{ value: string, onChange?: (value: string) => void }> {

    private readonly containerRef = createRef<HTMLDivElement>();

    public editor: monaco.editor.IStandaloneCodeEditor;
    public model = monaco.editor.createModel('');

    public componentDidMount() {
        this.editor = monaco.editor.create(this.containerRef.current, {
            language: 'yaml',
            automaticLayout: true,
            theme: 'vs-dark'
        });
        this.model = monaco.editor.createModel(this.props.value, 'yaml');
        this.editor.setModel(this.model);
        this.model.onDidChangeContent(() => this.props.onChange && this.props.onChange(this.model.getValue()));
    }

    public componentDidUpdate() {
        this.model.setValue(this.props.value);
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
    public model = monaco.editor.createModel('');

    public componentDidMount() {
        this.editor = monaco.editor.createDiffEditor(this.containerRef.current, {
            automaticLayout: true,
            theme: 'vs-dark'
        });
        this.original = monaco.editor.createModel(this.props.original);
        this.model = monaco.editor.createModel(this.props.value);
        this.editor.setModel({
            original: this.original,
            modified: this.model
        });
    }

    public componentDidUpdate() {
        this.original.setValue(this.props.original);
        this.model.setValue(this.props.value);
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