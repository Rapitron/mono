import { inject } from '@rapitron/react';
import { StoreExplorerService } from './store-explorer.component';

export const StoreExploreStateViewComponent = inject(({ injector }) => {
    const service = injector.get(StoreExplorerService);
    return <>
        <If condition={state.selectedAction && !state.selectedChange}>
            {() => {
                const diff = getStoreActionDiff();
                return <MonacoDiffEditor original={diff.original} value={diff.value} />
            }}
        </If>
        <If condition={state.selectedAction && state.selectedChange}>
            {() => {
                const diff = getActionChangeDiff();
                return <MonacoDiffEditor original={diff.original} value={diff.value} />
            }}
        </If>
        <If condition={state.selectedStoreIndex != null && !state.selectedAction}>
            {() => (
                <div style={{
                    display: 'grid',
                    gridTemplateRows: 'auto max-content',
                    gap: '10px',
                    padding: '10px',
                    background: 'var(--background-secondary-color)',
                    color: 'var(--background-secondary-text-color)',
                }}>
                    <MonacoEditor
                        ref={monacoEditorRef}
                        value={getStoreState()}
                    />
                    <button
                        style={{
                            cursor: 'pointer',
                            padding: '5px 10px',
                            border: 'none',
                            background: 'var(--select-color)',
                            color: 'var(--select-text-color)'
                        }}
                        onClick={() => {
                            const value = tryParseJson(monacoEditorRef.current.model.getValue());
                            if (value) {
                                const changes = $Changes.get(getStoreState(), value);
                                extension.send('update', {
                                    index: state.selectedStoreIndex,
                                    changes
                                });
                            }
                        }}>
                        Update
                    </button>
                </div>
            )}
        </If>
    </>;
});
