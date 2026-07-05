const SectionTitle = ({
    title,
    subtitle,
    action,
}) => {

    return (
        <div className="mb-6 flex items-center justify-between">

            <div>

                <h2 className="text-3xl font-bold text-white">
                    {title}
                </h2>

                {subtitle && (
                    <p className="mt-1 text-zinc-400">
                        {subtitle}
                    </p>
                )}

            </div>

            {action}

        </div>
    );
};

export default SectionTitle;