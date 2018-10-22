
import React from "react";
import PropTypes from "prop-types";

import { format } from "d3-format";
import { timeFormat } from "d3-time-format";

import { ChartCanvas, Chart } from "react-stockcharts";
import {
	BarSeries,
	AreaSeries,
} from "react-stockcharts/lib/series";
import {  Label } from "react-stockcharts/lib/annotation";
import { discontinuousTimeScaleProvider } from "react-stockcharts/lib/scale";
import { XAxis, YAxis } from "react-stockcharts/lib/axes";
import {
	CrossHairCursor,
	MouseCoordinateX,
	MouseCoordinateY,
} from "react-stockcharts/lib/coordinates";

import { SingleValueTooltip } from "react-stockcharts/lib/tooltip";
import { fitWidth } from "react-stockcharts/lib/helper";
import { last } from "react-stockcharts/lib/utils";

class AreaChartWithEdge extends React.Component {
	render() {
		const { type, data: initialData, width, ratio } = this.props;

		const xScaleProvider = discontinuousTimeScaleProvider
			.inputDateAccessor(d => d.date);
		const {
			data,
			xScale,
			xAccessor,
			displayXAccessor,
		} = xScaleProvider(initialData);

		const start = xAccessor(last(data));
		const end = xAccessor(data[Math.max(0, data.length - 10)]);
		const xExtents = [start, end];
		return (
			<ChartCanvas height={400}
                clamp={true}
				ratio={ratio}
				width={width}
				margin={{ left: 20, right: 20, top: 20, bottom: 30 }}
				type={type}
				seriesName="ETHUSD"
				data={data}
				xScale={xScale}
				xAccessor={xAccessor}
				displayXAccessor={displayXAccessor}
				xExtents={xExtents}
			>
			
			<Label 
				x={(width - 40) / 2} y={60}
				fontSize={30} 
				text="ETHUSD" 
				fill='#BDC4C7'
				opacity={0.1} 
				fontFamily='roboto'
				/>

				<Chart id={1} yExtents={d => [d.high, d.low]}>
					<XAxis axisAt="bottom" orient="bottom" ticks={15} stroke="#BDC4C7" tickStroke="#BDC4C7"/>
					<YAxis axisAt="right" orient="left" ticks={5} tickStroke="#BDC4C7"/>

					<MouseCoordinateX
						at="bottom"
						orient="bottom"
						displayFormat={timeFormat("%Y-%m-%d")} />
					<MouseCoordinateY
						at="right"
						orient="left"
						displayFormat={format(".2f")} />

					<AreaSeries yAccessor={d => d.close}/>

					<SingleValueTooltip
						xLabel="Date" /* xLabel is optional, absence will not show the x value */ 
						yLabel="Close"
						yAccessor={d => d.close}
						xAccessor={d => d.date}
						xDisplayFormat={timeFormat("%Y-%m-%d %H:%M:%S")} yDisplayFormat={format(".2f")}
						origin={[-40, 0]}
						valueFill= "#FFFFFF"
						/>
						
				</Chart>

				<CrossHairCursor />
			</ChartCanvas>
		);
	}
}

AreaChartWithEdge.propTypes = {
	data: PropTypes.array.isRequired,
	width: PropTypes.number.isRequired,
	ratio: PropTypes.number.isRequired,
	type: PropTypes.oneOf(["svg", "hybrid"]).isRequired,
};

AreaChartWithEdge.defaultProps = {
	type: "svg",
};
AreaChartWithEdge = fitWidth(AreaChartWithEdge);

export default AreaChartWithEdge;
