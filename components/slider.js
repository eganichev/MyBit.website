import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import animateScrollTo from 'animated-scroll-to';
import { Highlight } from '../components/highlights'
import stylesheet from './slider.scss'
import hlstyles from './highlights.scss'
import { ArrowButton } from './arrow-button';
import { MediaList } from './icon';
import { IndustriesMain } from './industries-main';

export class Slider extends React.Component {
  constructor(props) {
    super(props);
    this.state = {currentScroll: 0, isBeginning: true, isEnd: false}
    this.scroll = this.scroll.bind(this);
    this.list = this.props.listRef;

    this.setListRef = element => {
      this.list = element;
    };
  }

  componentDidMount() {
    const intervalId = setInterval(() => { this.scroll(1) }, 3000);
    this.setState({
      intervalId
    });
  }

  componentWillUnmount() {
    clearInterval(this.state.intervalId);
  }

  scroll(direction){
    const element = this.list;
    const width = element.offsetWidth;
    const iconWidth = 200;
    const scrollWidth = element.scrollWidth;
    const offset = iconWidth * direction;
    const toScroll = scrollWidth - width;
    const futurePosition = this.state.currentScroll + offset;
    const offSetToMin = 0 + futurePosition;
    const offSetToMax = toScroll - futurePosition;
    
    // case where we are going to be resetting scroll, which does it as well if there are only 100px left or less
    if(futurePosition <= 0 || offSetToMin <= 100 || this.state.isEnd){
      animateScrollTo(0, {minDuration: 5, maxDuration: 5, element, horizontal: true});
      this.setState({currentScroll: 0, isBeginning: true, isEnd: false})
    }
    // case where we are going to be scrolling to the end, which does it as well if there are only 100px left or less
    else if(futurePosition >= toScroll || offSetToMax <= 100){
      animateScrollTo(toScroll, {minDuration: 500, element, horizontal: true});
      this.setState({currentScroll: toScroll, isEnd: true, isBeginning: false})
    }
    // case where we have not reached an endge
    else{
      animateScrollTo(futurePosition, {minDuration: 500, element, horizontal: true});
      this.setState({currentScroll: futurePosition, isBeginning: false, isEnd: false})
    }
  }

  render() {
    const sliderWrapperClass = classNames({
      'Slider--is-always-row': this.props.isAlwaysRow,
      'Slider--has-arrows-tablet': this.props.hasArrowsTablet,
      'Slider': true,
    })

    return (
      <div className={sliderWrapperClass} >
        <style dangerouslySetInnerHTML={{ __html: stylesheet }} />
        {<ArrowButton onClick={() => this.scroll(-1)} disabled={this.state.isBeginning} isBig={this.props.bigArrows} type={this.props.type}/>}
        {React.cloneElement(this.props.children, { setRef: this.setListRef })}
        {<ArrowButton onClick={() => this.scroll(1)} disabled={this.state.isEnd} rotate isBig={this.props.bigArrows} type={this.props.type}/>}
      </div>
    );
  }
}

export const SliderMediaList = ({type}) => {
  return(
    <div className="sliderMediaList">
    <style dangerouslySetInnerHTML={{ __html: hlstyles }} />
    <Highlight
      noBit
      title={'Media'}
      isLight
      isTransparent
      isBig
      isFullWidth
      style={{ margin: 'auto' }}
      isContentANode
      content={
        <Slider
          isAlwaysRow={false}
          bigArrows={false}
          hasArrowsTablet={true}
          type={type}
        >
          <MediaList />
        </Slider>}
    />
    </div>
  )
}

export const SliderIndustries = () => (
  <Slider
    isAlwaysRow
    bigArrows
    hasArrowsTablet
  >
    <IndustriesMain />
  </Slider>
)

Slider.propTypes = {
  isAlwaysRow: PropTypes.bool.isRequired,
  bigArrows: PropTypes.bool.isRequired,
  hasArrowsTablet: PropTypes.bool.isRequired,
  listRef: PropTypes.func,
  children: PropTypes.element.isRequired,
}

SliderMediaList.propTypes = {
  type: PropTypes.string
}
