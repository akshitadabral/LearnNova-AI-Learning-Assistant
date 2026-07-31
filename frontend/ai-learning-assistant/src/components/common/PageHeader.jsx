import React from 'react'

const PageHeader = ({title, subtitle, children}) => {
    return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
            <h1 className="text-3xl font-semibold text-slate-900 tracking-tight mb-2">
                {title}
            </h1>
            {subtitle && (
                <p className="text-slate-500 text-base">
                    {subtitle}
                </p>
            )}
        </div>
        {children && <div>{children}</div>}
    </div>
    )
}

export default PageHeader