import React from 'react';
import {Quote} from 'lucide-react';

interface BlockquoteProps {
    children: React.ReactNode;
    title?: string;
    cite?: string;
    icon?: React.ReactNode;
}

export const Blockquote = ({
                               children,
                               title,
                               cite,
                               icon = <Quote size={20}/>,
                           }: BlockquoteProps) => {
    return (
        <blockquote className="my-6 border-l-4 border-gray-300 bg-gray-50 p-5 rounded-r-sm">
            <div className="flex gap-4">
                {icon && (
                    <div className="mt-1 shrink-0 text-gray-400">
                        {icon}
                    </div>
                )}

                <div className="flex-1">
                    {title && (
                        <div className="font-bold text-base mb-1 text-gray-900 uppercase tracking-wide">
                            {title}
                        </div>
                    )}

                    <div className="text-gray-700 leading-relaxed italic">
                        {children}
                    </div>

                    {cite && (
                        <cite className="block mt-3 text-sm text-gray-500 not-italic font-medium">
                            — {cite}
                        </cite>
                    )}
                </div>
            </div>
        </blockquote>
    );
};