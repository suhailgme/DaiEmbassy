
import React from "react";
import PropTypes from "prop-types";

import { format } from "d3-format";
import { timeFormat } from "d3-time-format";

import { ChartCanvas, Chart, ZoomButtons } from "react-stockcharts";
import {
	BarSeries,
	AreaSeries,
	LineSeries
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
import EdgeIndicator from "react-stockcharts/lib/coordinates/EdgeIndicator";

class AreaChartWithEdge extends React.Component {
	state = {suffix: 1}

	handleReset = () => {
		this.setState({suffix: this.state.suffix + 1})
	}

	render() {
		const { type, data: initialData, width, ratio, market } = this.props;

		const xScaleProvider = discontinuousTimeScaleProvider
			.inputDateAccessor(d => d.date);
		const {
			data,
			xScale,
			xAccessor,
			displayXAccessor,
		} = xScaleProvider(initialData);

		const start = xAccessor(last(data));
		const end = xAccessor(data[Math.max(0, data.length - 100)]);
		const xExtents = [start, end];
		return (
			<ChartCanvas height={490}
                // clamp={true}
				ratio={ratio}
				width={width}
				margin={{ left: 10, right: 10, top: 20, bottom: 30 }}
				type={type}
				seriesName={`DAIUSD_${this.state.suffix}`}
				data={data}
				xScale={xScale}
				xAccessor={xAccessor}
				displayXAccessor={displayXAccessor}
				xExtents={xExtents}
			>
			<Label 
				x={width  / 2} y={100}
				fontSize={28} 
				text= 'DAI / USD + DAI MCAP, 1D'
				fill='#BDC4C7'
				opacity={0.15} 
				fontFamily='roboto'
				/>
				
				<Label 
				x={width  / 2} y={140}
				text= "Dai Embassy"
				fill='#BDC4C7'
				opacity={0.15} 
				fontFamily='roboto'
				fontSize={20}
				/>

			<Chart id={1} yExtents={d => [d.high, d.low]}>
				<XAxis axisAt="bottom" orient="bottom"  stroke="#BDC4C7" tickStroke="#BDC4C7"/>
				<YAxis axisAt="right" orient="left" ticks={5} tickStroke="#BDC4C7"/>

				<MouseCoordinateX
					at="bottom"
					orient="bottom"
					displayFormat={timeFormat("%Y-%m-%d %H:%M")} />
				<MouseCoordinateY
					at="right"
					orient="left"
					displayFormat={format("$.3f")} />
					

				<AreaSeries yAccessor={d => d.close} fill='#1678C2' stroke='#1678C2'/>
				<LineSeries yAccessor={() => 1} strokeDasharray="ShortDot" stroke='#FF0000'/>
				<SingleValueTooltip
						xLabel="Market Cap."
						yLabel="Volume (USD)"
						xAccessor={d => d.mcap}
						yAccessor={d => d.volume}
						xDisplayFormat={format(".4s")} 
						yDisplayFormat={format(".4s")}
						origin={[10, 20]}
						valueFill= "#FFFFFF"
					/>
				<SingleValueTooltip
					xLabel="Date" /* xLabel is optional, absence will not show the x value */ 
					yLabel="Close"
					yAccessor={d => d.close}
					xAccessor={d => d.date}
					xDisplayFormat={timeFormat("%Y-%m-%d %H:%M")} 
					yDisplayFormat={format("$.3f")}
					origin={[10, 0]}
					valueFill= "#FFFFFF"
					/>	
				<ZoomButtons onReset={this.handleReset}/>
				<EdgeIndicator itemType='last' orient='left' edgeAt='right' displayFormat={format("$.3f")}   fill={d => d.close > d.open ? "#6BA583" : "#FF0000"} yAccessor={d=> d.close}/>

			</Chart>
			<Chart 
				id={2}
				yExtents={d => d.volume}
				height={150} origin={(w, h) => [0, h - 150]}>
			{/* <YAxis axisAt="left" orient="right" ticks={5} tickStroke="#BDC4C7" tickFormat={format(".2s")}/> */}

			{/* <MouseCoordinateY
				at="left"
				orient="right"
				displayFormat={format(".4s")}
				/> */}

			<BarSeries yAccessor={d => d.volume}
				stroke fill={(d) => d.close > d.open ? "#6BA583" : "#FF0000"}
				opacity={0.4}
				widthRatio={1} />		

			</Chart>
			<Chart id={3} yExtents={d => d.mcap}>
				<LineSeries
					yAccessor={d=> d.mcap}
					stroke='#E6BB48'
					/>
				<MouseCoordinateY
					at="left"
					orient="right"
					displayFormat={format("$.4s")} />
			<YAxis axisAt="left" orient="right" ticks={5} tickStroke="#BDC4C7" tickFormat={format(".2s")}/>	
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
