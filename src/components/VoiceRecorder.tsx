"use client";

import { useEffect, useRef, useState } from "react";
import { Mic, Square, Play, X, Loader2 } from "lucide-react";

export function VoiceRecorder({
  value,
  onChange,
}: {
  value?: string;
  onChange: (dataUrl?: string) => void;
}) {
  const [recording, setRecording] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [encoding, setEncoding] = useState(false);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  async function start() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const mr = new MediaRecorder(stream, { mimeType: "audio/webm" });
      chunksRef.current = [];
      mr.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      mr.onstop = async () => {
        setEncoding(true);
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const reader = new FileReader();
        reader.onload = () => {
          onChange(reader.result as string);
          setEncoding(false);
        };
        reader.readAsDataURL(blob);
        stream.getTracks().forEach((t) => t.stop());
      };
      mr.start();
      recorderRef.current = mr;
      setRecording(true);
      setElapsed(0);
      timerRef.current = setInterval(() => setElapsed((e) => e + 1), 1000);
    } catch {
      alert("ما قدرناش نشغّل المايك. اتأكد إن المتصفح عنده إذن للوصول.");
    }
  }

  function stop() {
    if (recorderRef.current && recording) {
      recorderRef.current.stop();
      if (timerRef.current) clearInterval(timerRef.current);
      setRecording(false);
    }
  }

  if (value) {
    return (
      <div className="flex items-center gap-2 rounded-xl bg-ink-50 p-3">
        <audio src={value} controls className="flex-1" />
        <button
          onClick={() => onChange(undefined)}
          className="rounded-lg bg-rose-100 px-2 py-1 text-xs text-rose-700 hover:bg-rose-200"
        >
          <X className="h-3 w-3" />
        </button>
      </div>
    );
  }

  if (encoding) {
    return (
      <div className="flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-ink-200 bg-ink-50 p-4 text-sm text-ink-600">
        <Loader2 className="h-4 w-4 animate-spin" />
        جاري الحفظ...
      </div>
    );
  }

  return (
    <button
      onClick={recording ? stop : start}
      className={`flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed p-4 text-sm font-bold transition ${
        recording
          ? "border-rose-300 bg-rose-50 text-rose-700 animate-pulse"
          : "border-ink-200 bg-ink-50 text-ink-700 hover:border-gold-400 hover:bg-gold-50"
      }`}
    >
      {recording ? (
        <>
          <Square className="h-5 w-5 fill-current" />
          <span>إيقاف ({elapsed} ث)</span>
        </>
      ) : (
        <>
          <Mic className="h-5 w-5" />
          <span>سجّل رسالة صوتية</span>
        </>
      )}
    </button>
  );
}
