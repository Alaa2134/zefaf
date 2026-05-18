"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, X } from "lucide-react";

export function AdminOrderActions({ orderId }: { orderId: string }) {
  const router = useRouter();
  const [working, setWorking] = useState(false);

  async function act(action: "activate" | "reject") {
    if (action === "reject" && !confirm("متأكد إنك عايز ترفض الطلب ده؟")) return;
    setWorking(true);
    const res = await fetch(`/api/admin/orders/${orderId}/${action}`, { method: "POST" });
    setWorking(false);
    if (res.ok) router.refresh();
    else alert("حصلت مشكلة");
  }

  return (
    <div className="mt-3 grid grid-cols-2 gap-2">
      <button
        onClick={() => act("activate")}
        disabled={working}
        className="inline-flex items-center justify-center gap-1 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-bold text-white shadow disabled:opacity-50"
      >
        <Check className="h-4 w-4" />
        فعّل الدعوة
      </button>
      <button
        onClick={() => act("reject")}
        disabled={working}
        className="inline-flex items-center justify-center gap-1 rounded-xl bg-rose-600 px-4 py-2 text-sm font-bold text-white shadow disabled:opacity-50"
      >
        <X className="h-4 w-4" />
        ارفض
      </button>
    </div>
  );
}
