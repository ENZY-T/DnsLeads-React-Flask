import React from 'react';
import { Pagination, Navigation, Autoplay } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { GlobalData } from '../GlobalData';
import { Transition } from 'react-transition-group';
import { ThemeColors } from '../Styling/Colors';
import ServiceCard from '../components/ServiceCard';
import BulletText from '../components/BulletText';

const HomePage = () => {
	const inProp = true;
	return (
        <div>
            <section className="cover">
                <Swiper
                    spaceBetween={30}
                    centeredSlides={true}
                    autoplay={{
                        delay: 2500,
                        disableOnInteraction: false,
                    }}
                    pagination={{
                        clickable: true,
                    }}
                    navigation={true}
                    modules={[Autoplay, Pagination, Navigation]}
                    className="home-swiper"
                >
                    {GlobalData.media.home.slides.map((slideItem) => (
                        <Transition in={inProp} timeout={500} key={slideItem.id}>
                            <SwiperSlide key={slideItem.id}>
                                <div className="position-relative size-full">
                                    <img className="position-absolute z-index-0" src={slideItem.image} alt={'slide ' + slideItem.id} />
                                    <div className="position-relative z-index-1 w-50 ms-5 mt-5">
                                        <p
                                            className="display-3 text-start fw-bold"
                                            style={{
                                                color: ThemeColors.red,
                                                textShadow: `0 0 3px ${ThemeColors.yellow}`,
                                            }}
                                        >
                                            {slideItem.text1}
                                            <br />
                                            {slideItem.text2}
                                        </p>
                                        <p
                                            className=" z-index-1 text-start fw-bold mt-2"
                                            style={{
                                                color: ThemeColors.white,
                                                textShadow: `0 0 4px ${ThemeColors.black}`,
                                                fontFamily: 'sans-serif',
                                            }}
                                        >
                                            {slideItem.subText}
                                        </p>
                                    </div>
                                </div>
                            </SwiperSlide>
                        </Transition>
                    ))}
                </Swiper>
            </section>
            <section className="container my-md-3 pt-5 py-5">
                <p className="display-6 fw-normal" style={{ color: ThemeColors.red }}>
                    BEST CLEANING SOLUTIONS IN ADELAIDE
                </p>
            </section>
            <section className="container-fluid py-5" style={{ backgroundColor: ThemeColors.bg_grey }}>
                <div className="container">
                    <div className="d-flex flex-column flex-md-row flex-wrap justify-content-between align-items-center align-items-md-stretch">
                        {GlobalData.services.map((serviceItem, indx) => (
                            <ServiceCard dalayINDX={indx} key={serviceItem.id} serviceItem={serviceItem} />
                        ))}
                    </div>
                </div>
            </section>
            {/* Who we are */}
            <section className="container my-md-3 py-5">
                <div className="container row">
                    <div className="col-12 col-md-5 py-3" data-aos="fade-right">
                        <h4 className="fw-bold">WHO WE ARE...</h4>
                        <hr className="solid" />
                        <img className="img-fluid" src={GlobalData.media.home.who_we_are} alt="Who we are img" />
                    </div>
                    <div className="col-12 col-md-7 px-md-5 py-3" data-aos="fade-left" data-aos-delay="200">
                        <h4 className="fw-bold">BEST CLEANING SERVICES</h4>
                        <hr className="solid" />
                        <h5 className="fw-normal my-3">
                            <i>
                                DNS always strives to provide safe and healthy environments for its clients that are free of risks, hazards
                                and disrupts.
                            </i>
                        </h5>
                        <p style={{ color: ThemeColors.textColor_fade }}>
                            On all levels, DNS carries out its services professionally, ethically and sustainably. Its sole intention is to
                            contribute its energies to its customers to create and maintain a healthy and dynamic environment to uplift the
                            living and working standards.
                        </p>
                        <hr className="solid" />
                        <div className="row row-cols-1 row-cols-md-2 g-4">
                            <BulletText className="col">Comprehensive Solutions</BulletText>
                            <BulletText className="col">Professionally Trained Workforce</BulletText>
                            <BulletText className="col">The Highest Quality Standards</BulletText>
                            <BulletText className="col">Modern Tools and Machinery</BulletText>
                            <BulletText className="col">Cost Effective Service</BulletText>
                            <BulletText className="col">Hazard Free Services</BulletText>
                            <BulletText className="col">Capacity to Provide a 24/365 Service</BulletText>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomePage;
