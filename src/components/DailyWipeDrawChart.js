
import React from "react";
import PropTypes from "prop-types";

import { format } from "d3-format";
import { timeFormat } from "d3-time-format";
import { curveMonotoneX } from "d3-shape"
import { ChartCanvas, Chart, ZoomButtons } from "react-stockcharts";
import {
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
					label: "DAI Created",
					value: currentItem.daiCreated && numberFormat(currentItem.daiCreated),
					stroke: '#FF0000'
				},
				{
					label: "DAI Repaid",
					value: currentItem.daiRepaid && numberFormat(currentItem.daiRepaid),
                    stroke: '#189F3A',
                    
                },
                {
					label: "Circ. DAI",
					value: currentItem.totalDai && circFormat(currentItem.totalDai),
					stroke: '#E6BC4C'
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
		const end = xAccessor(data[Math.max(0, data.length - 183)]);
		const xExtents = [start, end];
		return (
			<ChartCanvas height={490}
                // clamp={true}
				ratio={ratio}
				width={width}
				margin={{ left: 10, right: 10, top: 20, bottom: 30 }}
				type={type}
				seriesName={`DAICREATEDREPAID_${this.state.suffix}`}
				data={data}
				xScale={xScale}
				xAccessor={xAccessor}
				displayXAccessor={displayXAccessor}
				xExtents={xExtents}

			>
			<Label 
				x={width  / 2} y={100}
				fontSize={30} 
				text="DAI Repayment and Creation, 1D"
				fill='#E8EDE5'
				opacity={0.15} 
				fontFamily='roboto'
				/>
				<Label 
				x={width  / 2} y={140}
				text="Dai Embassy"
				fill='#E8EDE5'
				opacity={0.15} 
				fontFamily='roboto'
				fontSize={20}
				/>

			<Chart id={1} yExtents={d => [d.daiCreated > d.daiRepaid ? d.daiCreated : d.daiRepaid, 0]}>
				<XAxis axisAt="bottom" orient="bottom"  stroke="#E8EDE5" tickStroke="#E8EDE5"/>
				<YAxis axisAt="right" orient="left" ticks={5} tickStroke="#E8EDE5"/>

				<MouseCoordinateX
					at="bottom"
					orient="bottom"
					displayFormat={timeFormat("%Y-%m-%d")} />
				<MouseCoordinateY
					at="right"
					orient="left"
					displayFormat={format(".4s")} />
					
				<AreaSeries yAccessor={d => d.daiRepaid} fill='#189F3A' stroke='#189F3A' interpolation={curveMonotoneX}/>
                <AreaSeries yAccessor={d => d.daiCreated} fill='#FF0000' stroke='#FF0000'interpolation={curveMonotoneX} />


				<SingleValueTooltip
					xLabel="DAI Repaid" /* xLabel is optional, absence will not show the x value */ 
					yLabel="DAI Created"
					yAccessor={d => d.daiCreated}
					xAccessor={d => d.daiRepaid}
					xDisplayFormat={format(".4s")} yDisplayFormat={format(".4s")}
					origin={[10, 0]}
					valueFill= "#FFFFFF"
					/>	
                    
				<SingleValueTooltip
					xLabel="Date" /* xLabel is optional, absence will not show the x value */ 
					yLabel="Circulating DAI"
					yAccessor={d => d.totalDai}
					xAccessor={d => d.date}
					xDisplayFormat={timeFormat("%Y-%m-%d")} yDisplayFormat={format(".4s")}
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
				<EdgeIndicator displayFormat={format(".4s")} itemType='last' orient='left' edgeAt='right' fill="#FF0000" yAccessor={d=> d.daiCreated}/>
				<EdgeIndicator displayFormat={format(".4s")} itemType='last' orient='left' edgeAt='right' fill="#6BA583" yAccessor={d=> d.daiRepaid}/>


			</Chart>
            <Chart id={2} yExtents={d => d.totalDai + 2000000}>
				<LineSeries 
					yAccessor={d=> d.totalDai}
                    stroke='#eca94b'
                    strokeWidth={2}
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
