import { Component, createSignal, Show } from 'solid-js';
import { hookForDev } from '../../../lib/devTools';
import { PrimalNote } from '../../../types/primal';
import ParsedNote from '../../ParsedNote/ParsedNote';
import NoteFooter from '../NoteFooter/NoteFooter';
import NoteHeader from '../NoteHeader/NoteHeader';
import { translateText } from '../../../lib/translate';

import styles from './NotePrimary.module.scss';


const NotePrimary: Component<{ note: PrimalNote, id?: string }> = (props) => {

  const [translation, setTranslation] = createSignal<string | null>(null);
  const [translating, setTranslating] = createSignal(false);

  const noteContent = () => {
    if (props.note.post.content) return props.note.post.content;
    return '';
  };

  const handleTranslate = async () => {
    if (translation()) {
      setTranslation(null);
      return;
    }

    setTranslating(true);
    const targetLang = navigator.language.split('-')[0] || 'en';
    const result = await translateText(noteContent(), targetLang);
    setTranslation(result);
    setTranslating(false);
  };

  return (
    <div
      id={props.id}
      class={styles.post}
      data-event={props.note.post.id}
      data-event-bech32={props.note.post.noteId}
    >
      <div class={styles.border}></div>
      <NoteHeader note={props.note} primary={true} />
      <div class={styles.content}>

        <div class={styles.message}>
          <ParsedNote note={props.note} width={Math.min(574, window.innerWidth)} />
        </div>

        <Show when={translation()}>
          <div class={styles.translated}>
            {translation()}
          </div>
        </Show>

        <Show when={noteContent().length > 0}>
          <button
            class={styles.translateButton}
            onClick={handleTranslate}
            disabled={translating()}
          >
            {translating() ? 'Translating...' : translation() ? 'Show original' : 'Translate'}
          </button>
        </Show>

        <NoteFooter note={props.note} wide={true} />
      </div>
    </div>
  )
}

export default hookForDev(NotePrimary);
