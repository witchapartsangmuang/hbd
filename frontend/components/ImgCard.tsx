export default function ImgCard({
    imgPath,
    rotateAngle,
    caption,
    aspectRatio = "3:4",
}: {
    imgPath: string;
    rotateAngle: number;
    caption: string;
    aspectRatio?: string;
}) {
    const [aw, ah] = aspectRatio.split(":").map(Number);
    return (
        <div
            className="rounded-2xl bg-white p-4 pb-5 shadow-xl transition duration-300 hover:-translate-y-1"
            style={{ transform: `rotate(${rotateAngle}deg)` }}
        >
            <div
                className="overflow-hidden rounded-xl bg-linear-to-br from-pink-100 via-rose-200 to-amber-100"
                style={{ aspectRatio: `${aw}/${ah}` }}
            >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className="h-full w-full object-cover" src={imgPath} alt={caption || ""} />
            </div>
            <p className="mt-3 text-center font-semibold text-rose-900">{caption}</p>
        </div>
    );
}
