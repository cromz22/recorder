interface taskUtterance {
  no: number;
  ja_speaker: string;
  en_speaker: string;
  ja_sentence: string;
  en_sentence: string;
  spkid: string;
  uttid: string;
}

export interface taskJson {
  task_id: string;
  set: string;
  conversation: taskUtterance[];
}

interface utterance {
  uttid: string;
  text: string;
  audio: string;
  recorded: boolean;
}

export interface allBlobsType {
  taskid: string;
  utterances: utterance[];
}
