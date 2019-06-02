
import React from "react";
import PropTypes from "prop-types";

import { format } from "d3-format";
import { timeFormat } from "d3-time-format";
import { curveMonotoneX } from "d3-shape"
import { ChartCanvas, Chart, ZoomButtons } from "react-stockcharts";
import {
	BarSeries,
    AreaSeries,
    LineSeries,
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
import { HoverTooltip } from "react-stockcharts/lib/tooltip";

const dateFormat = timeFormat("%Y-%m-%d");
const numberFormat = format('.4s')
const circFormat = format(',.0f')


function tooltipContent(ys) {
	return ({ currentItem, xAccessor }) => {
		return {
			x: dateFormat(xAccessor(currentItem)),
			y: [
                {
					label: "Cumulative DAI Created",
					value: currentItem.totalDaiDrawn && numberFormat(currentItem.totalDaiDrawn),
					stroke: '#FF0000'
				},
				{
					label: "Cumulative DAI Repaid",
					value: currentItem.totalDaiWiped && numberFormat(currentItem.totalDaiWiped),
                    stroke: '#189F3A',
                    
                },
                {
					label: "Cumulative DAI Liquidated",
					value: currentItem.totalDaiBitten && numberFormat(currentItem.totalDaiBitten),
					stroke: '#366b93'
				}
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
class AreaChartWithEdge extends React.Component {
	state = {suffix: 1}

	handleReset = () => {
		this.setState({suffix: this.state.suffix + 1})
	}

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
		const end = xAccessor(data[Math.max(0, data.length - 500)]);
		const xExtents = [start, end];
		return (
			<ChartCanvas height={490}
                // clamp={true}
				ratio={ratio}
				width={width}
				margin={{ left: 10, right: 10, top: 20, bottom: 30 }}
				type={type}
				seriesName={`CumulativeDebt${this.state.suffix}`}
				data={data}
				xScale={xScale}
				xAccessor={xAccessor}
				displayXAccessor={displayXAccessor}
				xExtents={xExtents}

			>
			<Label 
				x={width  / 2} y={100}
				fontSize={30} 
				text="Cumulative Debt, 1D"
				fill='#BDC4C7'
				opacity={0.15} 
				fontFamily='roboto'
				/>
				<Label 
				x={width  / 2} y={140}
				fontSize={30} 
				text="Dai Embassy"
				fill='#BDC4C7'
				opacity={0.15} 
				fontFamily='roboto'
				fontSize={20}
				/>

			<Chart id={1} yExtents={d => [d.totalDaiDrawn, 0]}>
				<XAxis axisAt="bottom" orient="bottom"  stroke="#BDC4C7" tickStroke="#BDC4C7"/>
				<YAxis axisAt="right" orient="left" ticks={5} tickStroke="#BDC4C7"/>

				<MouseCoordinateX
					at="bottom"
					orient="bottom"
					displayFormat={timeFormat("%Y-%m-%d")} />
				<MouseCoordinateY
					at="right"
					orient="left"
					displayFormat={format("$.4s")} />
					
				<AreaSeries yAccessor={d => d.totalDaiDrawn} fill='#FF0000' stroke='#FF0000' interpolation={curveMonotoneX}/>
                <AreaSeries yAccessor={d => d.totalDaiWiped} fill='#1f693d' stroke='#FFF' strokeOpacity={0.7} opacity={1} interpolation={curveMonotoneX} />
                <AreaSeries yAccessor={d => d.totalDaiBitten} fill='#24567E' stroke='#FFF' strokeOpacity={0.7} opacity={1} interpolation={curveMonotoneX} />

				{/* <LineSeries 
					yAccessor={d=> d.totalDaiDrawn}
                    stroke='#FF0000'
                    strokeWidth={2}
					/>
				<LineSeries 
					yAccessor={d=> d.totalDaiWiped}
                    stroke='#189F3A'
                    strokeWidth={2}
					/>
				<LineSeries 
					yAccessor={d=> d.totalDaiBitten}
                    stroke='#1678C2'
                    strokeWidth={2}
					/> */}


				<SingleValueTooltip
					xLabel="Cumulative DAI Created" /* xLabel is optional, absence will not show the x value */ 
					yLabel="Cumulative DAI Repaid"
					yAccessor={d => d.totalDaiWiped}
					xAccessor={d => d.totalDaiDrawn}
					xDisplayFormat={format(".4s")} 
					yDisplayFormat={format(".4s")}
					origin={[10, 0]}
					valueFill= "#FFFFFF"
					/>	
                    
				<SingleValueTooltip
					xLabel="Date"
					yLabel="Cumulative DAI Liquidated"
					xAccessor={d => d.date}
					yAccessor={d =>d.totalDaiBitten}
					xDisplayFormat={timeFormat("%Y-%m-%d")}
					yDisplayFormat={format(".4s")} 
					origin={[10, 20]}
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
				<EdgeIndicator displayFormat={format(".4s")} itemType='last' orient='left' edgeAt='right' fill="#FF0000" yAccessor={d=> d.totalDaiDrawn}/>
				<EdgeIndicator displayFormat={format(".4s")} itemType='last' orient='left' edgeAt='right' fill="#6BA583" yAccessor={d=> d.totalDaiWiped}/>
				<EdgeIndicator displayFormat={format(".4s")} itemType='last' orient='left' edgeAt='right' fill='#366b93' yAccessor={d=> d.totalDaiBitten}/>



			</Chart>
            {/* <Chart id={2} yExtents={d => d.totalDaiDrawn}>
				<LineSeries 
					yAccessor={d=> d.totalDaiWiped}
                    stroke='#eca94b'
                    strokeWidth={2}
					/>
					<AreaSeries yAccessor={d => d.cumulativePeth} fill='#189F3A' stroke='#189F3A'interpolation={curveMonotoneX} /> 
				<MouseCoordinateY
					at="left"
					orient="right"
					displayFormat={format("$.4s")} />
			<YAxis axisAt="left" orient="right" ticks={5} tickStroke="#BDC4C7" tickFormat={format(".2s")}/>	
			<EdgeIndicator displayFormat={format(".4s")} itemType='last' orient='right' edgeAt='left' fill="#6BA583" yAccessor={d=> d.cumulativePeth}/>

			</Chart> */}

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
