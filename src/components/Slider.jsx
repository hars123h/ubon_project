import React from 'react';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import waltonbd_slide1 from '../images/waltonbd_slide1.jpg';
import waltonbd_slide2 from '../images/waltonbd_slide2.jpg';
import waltonbd_slide3 from '../images/waltonbd_slide3.jpg';

import ubon_slide3 from '../images/ubon_slide3.png';
import ubon_slide2 from '../images/ubon_slide2.jpg';
import ubon_slide1 from '../images/ubon_slide1.jpg';

const Slider = () => {
  return (
    <div className='sm:w-3/5 lg:w-3/5 mx-auto '>
      <Carousel showThumbs={false} autoPlay showArrows={true} infiniteLoop>
        <div>
          <img src={ubon_slide1} className="h-[350px]" alt="img_2" />
        </div>
        <div>
          <img src={ubon_slide2} className="h-[350px]" alt="img_2" />
        </div>

        <div>
          <img src={ubon_slide3} className="h-[350px]" alt="img_1" />
        </div>

      </Carousel>
    </div>
  )
}

export default Slider;
