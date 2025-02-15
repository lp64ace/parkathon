import { EllipsisVertical } from "lucide-react";

function Options() {
    return (
        <button className="fixed top-4 left-4 z-10 bg-white p-1 rounded-full border-2 shadow-slate-300 shadow-md border-slate-600 hover:bg-slate-100 transition-colors hover:cursor-pointer">
            <EllipsisVertical size={32} color="#2e2e2e"/>
        </button>
    );
}

export default Options;
