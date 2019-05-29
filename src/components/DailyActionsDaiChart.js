
import React from "react";
import PropTypes from "prop-types";

import { format } from "d3-format";
import { timeFormat } from "d3-time-format";

import { scaleOrdinal, schemeCategory10, scalePoint } from  "d3-scale";
import { set } from "d3-collection";

import { ChartCanvas, Chart,ZoomButtons } from "react-stockcharts";
import { GroupedBarSeries } from "react-stockcharts/lib/series";
import {  Label } from "react-stockcharts/lib/annotation";

import { XAxis, YAxis } from "react-stockcharts/lib/axes";
import {
	CrossHairCursor,
	MouseCoordinateX,
	MouseCoordinateY,
} from "react-stockcharts/lib/coordinates";
import { SingleValueTooltip } from "react-stockcharts/lib/tooltip";


import { fitWidth } from "react-stockcharts/lib/helper";
import { last } from "react-stockcharts/lib/utils";

import { discontinuousTimeScaleProvider } from "react-stockcharts/lib/scale";
import { HoverTooltip } from "react-stockcharts/lib/tooltip";

const dateFormat = timeFormat("%Y-%m-%d");
const numberFormat = format('.4s')

function tooltipContent(ys) {

	return ({ currentItem, xAccessor }) => {
		return {
			x: dateFormat(xAccessor(currentItem)),
			y: [
				{
					label: "Lock",
					value: currentItem.lock && numberFormat(currentItem.lock),
					stroke: '#2a95dd'
				},
				{
					label: "Free",
					value: currentItem.free && numberFormat(currentItem.free),
					stroke: '#FA7D0E'
					
				},
				{
					label: "Wipe",
					value: currentItem.wipe && numberFormat(currentItem.wipe),
					stroke: '#2B922F'

				},
				{
					label: "Draw",
					value: currentItem.draw && numberFormat(currentItem.draw),
					stroke: '#C22324'
				},
				{
					label: "Total",
					value: currentItem.total && numberFormat(currentItem.total),
					stroke: '#FFF'
				},

			]
				.concat(
					ys.map(each => ({
						label: each.label,
						value: each.value(currentItem),
						stroke: each.stroke
					}))
				)
				.filter(line => line.value)
		};
	};
}

class GroupedBarChart extends React.Component {
	state = {suffix: 1}

	handleReset = () => {
		this.setState({suffix: this.state.suffix + 1})
	}
	render() {
		const { data: initialData, type, width, ratio } = this.props;

		const xScaleProvider = discontinuousTimeScaleProvider
		.inputDateAccessor(d => d.date);

		const {
			data,
			xScale,
			xAccessor,
			displayXAccessor,
		} = xScaleProvider(initialData);

		const start = xAccessor(last(data));
		const end = xAccessor(data[Math.max(0, data.length - 35)]);
		const xExtents = [start, end];

		const { mouseMoveEvent, panEvent, zoomEvent, zoomAnchor } = this.props;
		const { clamp } = this.props;


		const f = scaleOrdinal(schemeCategory10)
			.domain(set(data.map(d => d.region)));

		const fill = (d, i) => f(i);
		return (
			<ChartCanvas ratio={ratio} width={width} height={490}
					margin={{ left: 10, right: 10, top: 20, bottom: 30 }} 
					mouseMoveEvent={mouseMoveEvent}
					panEvent={panEvent}
					zoomEvent={zoomEvent}
					clamp={clamp}
					type={type}
					seriesName={`CDP Activity_${this.state.suffix}`}
					xExtents={xExtents}
					data={data}
					xAccessor={xAccessor} 
					displayXAccessor={displayXAccessor}
					xScale={xScale}
					padding={1}>
				<Label
					x={width / 2} y={100}
					fontSize={window.innerWidth > 768 ? 30 : 17}
					text="CDP Activity (Expressed in DAI), 1D"
					fill='#BDC4C7'
					opacity={0.15}
					fontFamily='roboto'
				/>
				<Label
					x={width / 2} y={140}
					fontSize={30}
					text="Dai Embassy"
					fill='#BDC4C7'
					opacity={0.15}
					fontFamily='roboto'
					fontSize={20}
				/>
					
				<Chart id={1}
						yExtents={[0, d => [d.lock, d.draw, d.wipe, d.free]]}>
				<XAxis axisAt="bottom" orient="bottom"  stroke="#BDC4C7" tickStroke="#BDC4C7"/>
				<YAxis axisAt="right" orient="left" ticks={5} tickStroke="#BDC4C7"/>
				<MouseCoordinateX
					at="bottom"
					orient="bottom"
					displayFormat={timeFormat("%Y-%m-%d")} />
				<MouseCoordinateY
					at="right"
					orient="left"
					displayFormat={format(".0f")} />
				<GroupedBarSeries yAccessor={[d => d.lock, d => d.free,d => d.wipe, d => d.draw, ]}
						fill={fill}
						spaceBetweenBar={2}
						widthRatio={0.6}
						/>
				<SingleValueTooltip
					xLabel="DAI Equiv. Locked" /* xLabel is optional, absence will not show the x value */ 
					yLabel="Dai Equiv. Freed"
					xAccessor={d => d.lock}
					yAccessor={d => d.free}
					xDisplayFormat={format(".4s")}
					yDisplayFormat={format(".4s")}
					origin={[0, 0]}
					valueFill= "#FFFFFF"
					/>	
					<SingleValueTooltip
					xLabel="DAI Wiped" /* xLabel is optional, absence will not show the x value */ 
					yLabel="Dai Drawn"
					xAccessor={d => d.wipe}
					yAccessor={d => d.draw}
					xDisplayFormat={format(".4s")}
					yDisplayFormat={format(".4s")}
					origin={[0, 20]}
					valueFill= "#FFFFFF"
					/>	
				<SingleValueTooltip
					xLabel="Date" /* xLabel is optional, absence will not show the x value */ 
					yLabel="Total Activity"
					yAccessor={d => d.total}
					xAccessor={d => d.date}
					xDisplayFormat={timeFormat("%Y-%m-%d")} yDisplayFormat={format(".4s")}
					origin={[0, 40]}
					valueFill= "#FFFFFF"
					/>	
				< HoverTooltip
				yAccessor = {d => d.date}
				tooltipContent = {tooltipContent([])}
				bgOpacity = {0.05}
				fill= "#273340"
				fontFill = "#FFF"
				stroke = 'rgba(255,255,255,0.2)'
				fontSize = {15}
				/>
				<ZoomButtons onReset={this.handleReset}/>
			</Chart>
			<CrossHairCursor/>
			</ChartCanvas>
		);
	}
}

GroupedBarChart.propTypes = {
	data: PropTypes.array.isRequired,
	width: PropTypes.number.isRequired,
	ratio: PropTypes.number.isRequired,
	type: PropTypes.oneOf(["svg", "hybrid"]).isRequired,
};

GroupedBarChart.defaultProps = {
	type: "svg",
	mouseMoveEvent: true,
	panEvent:true,
	zoomEvent: true,
	clamp: false
};
GroupedBarChart = fitWidth(GroupedBarChart);

export default GroupedBarChart;
