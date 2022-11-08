import React from "react";
import "./UserProfilePage.css";
import CampaignSnippet from "../../Components/CampaignSnippet/CampaignSnippet";
import MeetingBlocks from "./MeetingBlocks";
import { useEffect, useRef } from "react";
import InteractButton from "@interact/Components/Button/InteractButton";
import { useNavigate } from "react-router-dom";
import { Navigation, Pagination, Scrollbar } from "swiper";
import {SwiperSlide,Swiper} from 'swiper/react';
import CampaignCategorySelect from "../CreateCampaignPage/CampaignCategorySelect";

function FollowedCampaigns() {
  const currentCampaigns = [1, 2, 3];
  const navigate = useNavigate();

  const meetingBlockRef = useRef(null);

  const [swiper, setSwiper] = React.useState();
  const prevRef = React.useRef();
  const nextRef = React.useRef();

  React.useEffect(() => {
    if (swiper) {
      swiper.params.navigation.prevEl = prevRef.current;
      swiper.params.navigation.nextEl = nextRef.current;
      swiper.navigation.init();
      swiper.navigation.update();
    }
  }, [swiper]);

  useEffect(() => {
    meetingBlockRef.current.scrollTo(360 * 4, 0);
  }, []);

  return (
    <div style={{ paddingLeft: 100,paddingRight: 100 }}>
      <div
        ref={meetingBlockRef}
        className="horizontalScroll"
        style={{
          display: "flex",
          overflowX: "scroll",
          padding: 20,
          marginLeft: -120,
          paddingLeft: 140,
          marginRight: -20,
        }}
      >
        <MeetingBlocks passed={true} />
        <MeetingBlocks passed={true} />
        <MeetingBlocks passed={true} />
        <MeetingBlocks passed={true} />
        <MeetingBlocks />
        <MeetingBlocks />
        <MeetingBlocks />
        <MeetingBlocks />
        <MeetingBlocks />
        <MeetingBlocks />
      </div>
      <div style={{ margin: 20 }}>
        <InteractButton
          onClick={() => navigate("/interact/createcampaign")}
          style={{ paddingLeft: 200 }}
        >
          + Create New Campaign
        </InteractButton>
      </div>
      <div style={{position:"relative"}}>
        <div style={{ marginLeft: 20, textDecorationLine: "underline" }}>
          Interactions acquired
        </div>
          <Swiper
          breakpoints={{
            280: {
              slidesPerView: 1,
            },
            940: {
              slidesPerView: 2,
            },
            1280: {
              slidesPerView: 3,
            },
          }}
          slidesPerView={3}
          modules={[Navigation,Scrollbar]}
          navigation={{
            prevEl: prevRef?.current,
            nextEl: nextRef?.current
          }}
          updateOnWindowResize
          observer
          observeParents
          onSwiper={setSwiper}>
          {currentCampaigns.map((x, i) => (
            <SwiperSlide key={i}>
              <CampaignSnippet info={x} />
            </SwiperSlide>
          ))}
          </Swiper>
          <div className="swiper-button swiper-button-prev" ref={prevRef}></div>
          <div className="swiper-button swiper-button-next" ref={nextRef}></div>
        <br />
      </div>
      <div>
        <div style={{ marginLeft: 20, textDecorationLine: "underline" }}>
          Following campaigns
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-start",
            flexWrap: "wrap",
          }}
        >
          {currentCampaigns.map((x, i) => (
            <CampaignSnippet key={i} info={x} />
          ))}
        </div>
        <br />
      </div>
      <div>
        <div style={{ marginLeft: 20, textDecorationLine: "underline" }}>
          Supported campaigns
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-start",
            flexWrap: "wrap",
          }}
        >
          {currentCampaigns.map((x, i) => (
            <CampaignSnippet key={i} info={x} />
          ))}
        </div>
        <br />
      </div>
    </div>
  );
}

export default FollowedCampaigns;
