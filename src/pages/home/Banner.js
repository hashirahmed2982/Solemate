import React, { useEffect, useState } from 'react';
import { db, storage } from '../../firebase';

function BannerIncidator(props) {
  return (
    <button
      type="button"
      data-bs-target="#bannerIndicators"
      data-bs-slide-to={props.index}
      className={props.active ? "active" : ""}
      aria-current={props.active}
    />
  );
}

function BannerImage(props) {
  return (
    <div
      className={"carousel-item " + (props.active ? "active" : "")}
      data-bs-interval="5000"
    >
      <div
        className="ratio"
        style={{ "--bs-aspect-ratio": "50%", maxHeight: "460px" }}
      >
        <img
          className="d-block w-100 h-100 bg-dark cover"
          alt=""
          src={props.image}
        />
      </div>
      <div className="carousel-caption d-none d-lg-block">
      </div>
    </div>
  );
}

function Banner() {

  async function getData() {
    db.collection('products').onSnapshot((snapshot) => {
      setUrls(snapshot.docs.map(doc => {
        const url = doc.data().pictureURLs[0];
        return {url};
      }))
    })
  }

  const [urls, setUrls] = useState([])

  useEffect(() => {
    getData();
  }, [])

  

  return (
    <div
      id="bannerIndicators"
      className="carousel slide"
      data-bs-ride="carousel"
      style={{ marginTop: "56px" }}
    >
      <div className="carousel-indicators">
        <BannerIncidator index="0" active={true} />
        <BannerIncidator index="1" />
        <BannerIncidator index="2" />
      </div>
      <div className="carousel-inner">
        {urls.map((url, i) => {
          
          if (i == 0) {
            return (
              <BannerImage image={url.url} active={true}/>
            )
          }
          return (
            <BannerImage image={url.url}/>
          )
        })}
      </div>
    </div>
  );
}

export default Banner;
