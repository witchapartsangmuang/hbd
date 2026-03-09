export default function ImgCard({ imgPath, rotateAngle, caption }: { imgPath: string, rotateAngle: number, caption: string }) {
    return (
        <div className={`rounded-2xl bg-white p-4 pb-5 shadow-xl ${rotateAngle > 0 ? `rotate-${rotateAngle}` : `-rotate${rotateAngle}`} transition duration-300 hover:-translate-y-1`}>
            <div className="flex overflow-hidden items-center justify-center rounded-xl bg-linear-to-br from-pink-100 via-rose-200 to-amber-100 text-6xl">
                <img className="object-cover" src={imgPath} />
            </div>
            <p className="mt-3 text-center font-semibold text-rose-900">
                {caption}
            </p>
        </div>
    )
}