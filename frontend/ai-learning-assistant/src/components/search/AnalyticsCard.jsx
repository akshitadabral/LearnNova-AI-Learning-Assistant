import React from "react";

const AnalyticsCard = ({
    icon,
    title,
    value,
    color = "from-blue-500 to-cyan-500",
}) => {
    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 p-5">

            <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-r ${color}
                flex items-center justify-center text-white mb-4`}
            >
                {icon}
            </div>

            <p className="text-sm text-slate-500">
                {title}
            </p>

            <h2 className="text-3xl font-bold text-slate-900 mt-2">
                {value}
            </h2>

        </div>
    );
};

export default AnalyticsCard;