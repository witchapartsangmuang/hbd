import type { CSSProperties } from "react";
import { cx } from "@/lib/format";

type IconProps = { className?: string; style?: CSSProperties };

export function Facebook({ className, style }: IconProps) {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" xmlSpace="preserve" viewBox="0 0 455.73 455.73" className={cx("size-4", className)} style={style}>
			<path d="M0 0v455.73h242.704V279.691h-59.33v-71.864h59.33v-60.353c0-43.893 35.582-79.475 79.475-79.475h62.025v64.622h-44.382c-13.947 0-25.254 11.307-25.254 25.254v49.953h68.521l-9.47 71.864h-59.051V455.73H455.73V0z" style={{ fill: "#3a559f" }} />
		</svg>
	);
}

export function Instagram({ className, style }: IconProps) {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" aria-label="Instagram" viewBox="0 0 512 512" className={cx("size-4", className)} style={style}>
			<defs>
				<radialGradient id="ig-c" cx=".4" cy="1" r="1">
					<stop offset=".1" stopColor="#fd5" />
					<stop offset=".5" stopColor="#ff543e" />
					<stop offset="1" stopColor="#c837ab" />
				</radialGradient>
				<linearGradient id="ig-d" x2=".2" y2="1">
					<stop offset=".1" stopColor="#3771c8" />
					<stop offset=".5" stopColor="#60f" stopOpacity="0" />
				</linearGradient>
			</defs>
			<path id="ig-a" d="M0 0h512v512H0" />
			<use href="#ig-a" fill="url(#ig-c)" />
			<use href="#ig-a" fill="url(#ig-d)" />
			<g fill="none" stroke="#fff" strokeWidth="30">
				<rect width="308" height="308" x="102" y="102" rx="81" />
				<circle cx="256" cy="256" r="72" />
				<circle cx="347" cy="165" r="6" />
			</g>
		</svg>
	);
}

export function TikTok({ className, style }: IconProps) {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2238.29 2238.85" className={cx("size-4", className)} style={style}>
			<path d="M0 0h2238v2238H0" />
			<g style={{ transform: "translateX(100px) scale(.8)", transformOrigin: "50% 50%" }}>
				<g fill="#25f4ee">
					<path d="M779.38 890.55v-88.12a650.81 650.81 0 0 0-92.45-7.94c-299.8-.64-565.22 193.64-655.25 479.6S47.92 1871.34 294 2042.56a684.7 684.7 0 0 1 485.36-1152z" />
					<path d="M796 1888.72c167.62-.23 305.4-132.28 312.74-299.74V94.62h273A512.17 512.17 0 0 1 1373.8 0h-373.41v1492.92c-6.21 168.31-144.32 301.63-312.74 301.9a317.76 317.76 0 0 1-144.45-36.11A313.48 313.48 0 0 0 796 1888.72zM1891.66 601.64v-83.06a509.85 509.85 0 0 1-282.4-85.22 517.79 517.79 0 0 0 282.4 168.28z" />
				</g>
				<path fill="#fe2c55" d="M1609.26 433.36a514.19 514.19 0 0 1-127.84-339.47h-99.68a517.16 517.16 0 0 0 227.52 339.47zM686.93 1167.9a313.46 313.46 0 0 0-144.46 590.81A312.75 312.75 0 0 1 796 1262.51a329.69 329.69 0 0 1 92.44 14.49V897.05a654.77 654.77 0 0 0-92.44-7.22h-16.62v288.9a321.13 321.13 0 0 0-92.45-10.83z" />
				<path fill="#fe2c55" d="M1891.66 601.64v288.91a886.23 886.23 0 0 1-517.86-168.29v759.1c-.8 378.78-308.09 685.43-686.87 685.43A679.65 679.65 0 0 1 294 2042.56 685.43 685.43 0 0 0 1481.42 1576V819.05A887.71 887.71 0 0 0 2000 985.17v-372a529.59 529.59 0 0 1-108.34-11.53z" />
				<path fill="#fff" d="M1373.8 1481.36v-759.1a886.11 886.11 0 0 0 518.58 166.12v-288.9a517.87 517.87 0 0 1-283.12-166.12 517.16 517.16 0 0 1-227.52-339.47h-273V1589a313.46 313.46 0 0 1-567 171.17 313.46 313.46 0 0 1 144.46-590.83 321.35 321.35 0 0 1 92.45 14.45V894.88A684.71 684.71 0 0 0 293.29 2050.5a679.65 679.65 0 0 0 393.64 116.29c378.78 0 686.07-306.65 686.87-685.43z" />
			</g>
		</svg>
	);
}

export function X({ className, style }: IconProps) {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={cx("size-4", className)} style={style}>
			<path d="M0 0h24v24H0z" />
			<path fill="#fff" d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
		</svg>
	);
}

export function Youtube({ className, style }: IconProps) {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" xmlSpace="preserve" viewBox="0 0 1000 1000" className={cx("size-4", className)} style={style}>
			<path d="M500 1000C223.9 1000 0 776.1 0 500S223.9 0 500 0s500 223.9 500 500-223.9 500-500 500" fill="red" />
			<path d="M818.2 339.1c-7.6-28.8-30.1-51.4-58.7-59.1-51.8-14-259.4-14-259.4-14s-207.7 0-259.4 14c-28.6 7.7-51.1 30.3-58.7 59.1-14 52.1-14 160.9-14 160.9s0 108.8 13.9 160.9c7.6 28.8 30.1 51.4 58.7 59.1 51.8 14 259.4 14 259.4 14s207.7 0 259.4-14c28.6-7.7 51.1-30.3 58.7-59.1C832 608.8 832 500 832 500s0-108.8-13.8-160.9M432.1 598.7V401.3L605.6 500z" fill="#fff" />
		</svg>
	);
}

export function LinkedIn({ className, style }: IconProps) {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" fill="#fff" aria-label="LinkedIn" viewBox="0 0 512 512" className={cx("size-4", className)} style={style}>
			<path fill="#0077b5" d="M0 0h512v512H0" />
			<circle cx="142" cy="138" r="37" />
			<path stroke="#fff" strokeWidth="66" d="M244 194v198M142 194v198" />
			<path d="M276 282c0-20 13-40 36-40 24 0 33 18 33 45v105h66V279c0-61-32-89-76-89-34 0-51 19-59 32" />
		</svg>
	);
}

export function Mail({ className, style }: IconProps) {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" aria-label="Email" viewBox="0 0 512 512" className={cx("size-4", className)} style={style}>
			<path fill="#06a8f4" d="M0 0h512v512H0" />
			<rect width="356" height="256" x="78" y="128" fill="#fff" rx="8%" />
			<path fill="none" stroke="#03a9f4" strokeWidth="20" d="m305 256 129 128M207 256 78 384m0-256 165 164c7 8 19 8 26 0l165-164" />
		</svg>
	);
}

export function Line({ className, style }: IconProps) {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className={cx("size-4", className)} style={style}>
			<path d="M0 0h512v512H0" fill="#00b900" />
			{/* scale=3.2, content orig x:[101.865,221.865] y:[246.144,366.144] → screen [64,448] */}
			<g transform="matrix(3.2 0 0 -3.2 -261.968 1235.661)">
				<path d="M205.36 311.42c0 19.55-19.6 35.456-43.69 35.456s-43.7-15.906-43.7-35.456c0-17.527 15.543-32.205 36.54-34.98 1.423-.307 3.36-.94 3.85-2.155.44-1.104.288-2.835.14-3.95l-.623-3.74c-.19-1.104-.88-4.32 3.784-2.355s25.162 14.816 34.328 25.367h-.002c6.332 6.943 9.365 14 9.365 21.814" fill="#fff" />
				<g fill="#00b900">
					<path d="M152.793 320.868h-3.065a.85.85 0 0 1-.851-.85V300.98a.85.85 0 0 1 .851-.848h3.065a.85.85 0 0 1 .851.848v19.037a.85.85 0 0 1-.851.85m21.094.001h-3.064a.85.85 0 0 1-.851-.85v-11.3l-8.725 11.782a.93.93 0 0 1-.066.086l-.005.006-.067.067-.046.038-.022.017-.044.03-.026.015-.045.026-.027.013-.05.02-.027.01-.05.017-.03.008-.048.01-.036.005-.045.006-.044.003-.03.001h-3.064a.85.85 0 0 1-.851-.85V300.98a.85.85 0 0 1 .851-.848h3.064a.85.85 0 0 1 .852.848v11.307l8.734-11.797a.85.85 0 0 1 .217-.21l.06-.038.024-.014.04-.02.04-.018.025-.01.06-.018a.85.85 0 0 1 .23-.03h3.064a.85.85 0 0 1 .851.848v19.037a.85.85 0 0 1-.851.85" />
					<path d="M145.405 304.9h-8.327v15.12a.85.85 0 0 1-.85.851h-3.065a.85.85 0 0 1-.851-.851v-19.036a.84.84 0 0 1 .238-.588l.024-.025a.85.85 0 0 1 .587-.237h12.244a.85.85 0 0 1 .85.851v3.065a.85.85 0 0 1-.85.851m45.405 11.2a.85.85 0 0 1 .85.851v3.065a.85.85 0 0 1-.85.851h-12.244a.88.88 0 0 1-.6-.24c-.015-.014-.02-.02-.023-.024a.84.84 0 0 1-.236-.586V300.98a.84.84 0 0 1 .238-.588l.023-.023a.85.85 0 0 1 .588-.238H190.8a.85.85 0 0 1 .85.85v3.066a.85.85 0 0 1-.85.851h-8.326v3.218h8.326a.85.85 0 0 1 .85.851v3.064a.85.85 0 0 1-.85.852h-8.326v3.217h8.326z" />
				</g>
			</g>
		</svg>
	);
}
