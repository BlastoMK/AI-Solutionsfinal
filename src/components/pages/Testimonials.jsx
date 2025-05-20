import React from "react";
import Slider from "react-slick";
import { testimonials } from "../data/dummydata";
import { BsStarFill, BsStar } from "react-icons/bs";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export const Testimonials = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
  };

  const renderStars = (rating) => {
    return Array(5).fill(0).map((_, i) => (
      i < rating ? 
        <BsStarFill key={i} className="star-filled" /> : 
        <BsStar key={i} className="star-empty" />
    ));
  };

  return (
    <section className='testimonials hero'>
      <div className='container'>
        <div className='heading'>
          <h2>Client Ratings & Reviews</h2>
          <p>Don't just take our word for it - see what our clients say</p>
        </div>
        
        <Slider {...settings}>
          {testimonials.map((val) => (
            <div className='box' key={val.id}>
              <div className='user-header'>
                <div className='img'>
                  <img src={val.avatar} alt={val.name} />
                </div>
                <div className='user-info'>
                  <h3>{val.name}</h3>
                  <p>{val.position}</p>
                  <span className='company'>{val.company}</span>
                </div>
              </div>
              
              <div className='rating'>
                {renderStars(val.rating)}
                <span className='date'>{new Date(val.date).toLocaleDateString()}</span>
              </div>
              
              <p className='content'>"{val.content}"</p>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
};