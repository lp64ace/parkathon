import { EllipsisVertical } from "lucide-react";

function Options() {
    return (
        <button className="fixed top-4 left-4 z-999 rounded-full border-2 border-slate-600 bg-white p-2 shadow-sm shadow-slate-500 transition-colors hover:cursor-pointer hover:bg-slate-100">
            <EllipsisVertical size={32} color="#2e2e2e" />
        </button>
    );
}

export default Options;
