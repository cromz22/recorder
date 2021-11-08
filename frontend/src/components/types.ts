export interface inputUtteranceType {
  no: number;
  ja_speaker: string;
  en_speaker: string;
  ja_sentence: string;
  en_sentence: string;
  spkid: string;
  uttid: string;
}

export interface inputJsonType {
  task_id: string;
  set: string;
  conversation: inputUtteranceType[];
}

export interface outputUtteranceType {
  uttid: string;
  text: string;
  audio: string;
  lang: string;
  recorded: boolean;
}

export interface outputJsonType {
  taskid: string;
  utterances: outputUtteranceType[];
}
