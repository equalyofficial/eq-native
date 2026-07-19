import Svg, {
  Defs,
  LinearGradient as SvgGradient,
  Path,
  Stop,
} from "react-native-svg";

const COORD_W = 100;

export function Sparkline({
  data,
  color,
  height = 30,
  width = "100%",
  fillOpacity = 0.22,
}: {
  data: number[];
  color: string;
  height?: number;
  width?: number | string;
  fillOpacity?: number;
}) {
  if (data.length < 2) return null;

  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const stepX = COORD_W / (data.length - 1);

  const points = data.map((value, i) => {
    const x = i * stepX;
    const y = height - ((value - min) / range) * (height - 4) - 2;
    return [x, y] as const;
  });

  const line = points
    .map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`)
    .join(" ");
  const area = `${line} L${COORD_W},${height} L0,${height} Z`;
  const gradientId = `spark-${color.replace("#", "")}`;

  return (
    <Svg
      width={width}
      height={height}
      viewBox={`0 0 ${COORD_W} ${height}`}
      preserveAspectRatio="none"
    >
      <Defs>
        <SvgGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={color} stopOpacity={fillOpacity} />
          <Stop offset="1" stopColor={color} stopOpacity={0} />
        </SvgGradient>
      </Defs>
      <Path d={area} fill={`url(#${gradientId})`} />
      <Path
        d={line}
        stroke={color}
        strokeWidth={1.5}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={0.9}
      />
    </Svg>
  );
}
