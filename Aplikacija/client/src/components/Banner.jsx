import '../styles/Banner.css';
import '../styles/MainButton.css';

import { useEffect, useState } from "react";
import { NavLink } from 'react-router-dom';
import { Link } from 'react-router-dom';

import { useContext } from 'react';
import AuthContext from '../context/AuthContext';

export const Banner = () => {
    const [scrollPosition, setScrollPosition] = useState(0);
  
    const handleScroll = () => setScrollPosition(window.scrollY);
  
    useEffect(() => {
      window.addEventListener("scroll", handleScroll, { passive: true });
  
      return () => {
        window.removeEventListener("scroll", handleScroll);
      };
    }, []);

    return (
      <div className="page home-page">
        <section
          style={{
            backgroundSize: `${(window.outerHeight - scrollPosition) / 3}%`,
          }}
          className="banner bannerContainer"
        >
          <h2>ZakažiLab</h2>
          <Link to="/login">
            <button to="/login" className="main-button" onClick={() => console.log("useless button")}>Prijavi se</button>
          </Link>
          {/* <button className="main-button">Prijavi se</button> */}
        </section>
        <section>
        <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce quis nisl at nisi sagittis hendrerit. Vivamus ac diam quis elit vehicula rhoncus sit amet eget odio. Nam lacinia ex in odio pharetra posuere. Morbi dui nisl, rutrum sit amet nisi in, tristique efficitur dui. Sed tincidunt, erat in porta varius, dui tellus dignissim sem, id tempor mauris eros ac magna. Proin tristique augue sit amet tincidunt vulputate. Nullam ullamcorper nisl id feugiat efficitur. Cras eu magna a enim maximus imperdiet. Curabitur at risus diam. Proin dignissim at augue eu cursus. Phasellus vehicula risus a turpis varius, dapibus vehicula arcu consectetur. Proin eget dolor pellentesque, euismod ipsum et, accumsan eros. Nunc accumsan ex nisl, hendrerit lobortis ex placerat id. Nunc ullamcorper tellus vel malesuada hendrerit. Aenean quis risus elit. Sed sagittis et massa vel consequat.

            Nulla at dui elementum, vulputate tortor eget, vehicula massa. Aenean vitae enim massa. Donec ultrices tellus at purus lobortis laoreet. Suspendisse purus lacus, tristique vitae sodales ut, hendrerit nec nibh. Aenean venenatis eleifend lorem, non sodales purus posuere ac. Duis vulputate, purus at mattis dignissim, arcu massa auctor dui, et pretium ante urna sed felis. Mauris venenatis neque ac ante hendrerit, sed facilisis mi congue. In suscipit egestas tincidunt. Aenean id odio at erat pharetra euismod. Sed malesuada suscipit risus, at maximus elit ultricies at. Mauris malesuada tempor purus, ut aliquet erat aliquet id. Phasellus suscipit ex eu lobortis tincidunt. Maecenas id ligula sit amet neque condimentum cursus. Curabitur vitae ligula sodales, interdum lacus iaculis, feugiat elit.

            Cras tristique ipsum elit, quis dictum justo elementum sed. Praesent et suscipit justo. Fusce mauris urna, ullamcorper non bibendum non, pharetra quis elit. Cras vehicula scelerisque erat a ultricies. Nam odio risus, tempus sit amet suscipit nec, placerat eget velit. Ut vel dapibus elit. Ut augue neque, auctor at pulvinar vel, sodales non nisl. Vestibulum non nisi quis tellus finibus dignissim rhoncus a felis. Nullam mollis et sem in semper. Aenean ut ante et velit rhoncus sodales ac in sapien. Duis bibendum dui vitae eros tincidunt, vitae dictum sem fermentum. Ut tincidunt erat quis nunc sollicitudin, aliquam malesuada erat bibendum. Aliquam dictum eleifend eros, ut blandit augue. Vivamus vehicula pellentesque dui, et facilisis velit. Cras vehicula gravida sem, elementum vulputate justo ultrices in. Sed eu ante sagittis, pulvinar felis nec, mollis ligula.

            Nam id mauris id leo volutpat congue ac sit amet lectus. Cras lobortis fringilla nisl et molestie. Phasellus porttitor condimentum neque eu consectetur. Aenean nec eleifend velit. Proin consequat, eros a convallis gravida, libero erat vehicula nisi, ut fringilla turpis ipsum lacinia nunc. Ut volutpat elit eget ipsum fermentum, eget tempus lectus faucibus. Maecenas varius suscipit mi, in tristique arcu accumsan sit amet. Integer quis tellus nec nisl congue finibus id vel dui. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos
            </p>
        </section>
      </div>
    );
  };
export default Banner;

