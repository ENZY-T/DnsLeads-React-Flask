import React from 'react';
import PageHeader from '../components/PageHeader';
import { ThemeColors } from '../Styling/Colors';

import { Link } from 'react-router-dom';
import { allEquipments, allProducts } from '../GlobalData';
import { AboutPageLine } from './AboutUs';

import eq1 from '../img/equipments/eq1.jpg';
import { useState } from 'react';

function ProductBox({ data }) {
    return (
        <div className="product-box">
            <div className="img">
                <img src={data.img} />
            </div>
            <a href={data.to} target="_blank">
                <h4>{data.name}</h4>
            </a>

            <p>{data.details}</p>
        </div>
    );
}

function EquipmentBox({ equipment, setImgData }) {
    const showImg = () => {
        setImgData({ iseOpen: true, img: equipment.img, name: '' });
    };
    return (
        <div className="eq-img" onClick={showImg} style={{ backgroundImage: `url(${equipment.img})` }}>
            <span></span>
        </div>
    );
}

function ImagePreviewer({ equipment, setData }) {
    const closePreview = () => {
        setData({ iseOpen: false, img: '', name: '' });
    };

    return (
        <div className="preview-container">
            <div className="preview-bg" onClick={closePreview}></div>
            <div className="preview-img">
                <div className="img" style={{ backgroundImage: `url(${equipment.img})` }}></div>
            </div>
            <div className="preview-close" onClick={closePreview}>
                <i class="fa fa-close"></i>
            </div>
        </div>
    );
}

function ProductsAndEquipment() {
    const [showImageData, setShowImageData] = useState({ iseOpen: false, img: '', name: '' });

    return (
        <div className="products-and-equipments">
            {showImageData.iseOpen ? <ImagePreviewer equipment={showImageData} setData={setShowImageData} /> : ''}
            <PageHeader headertxt="PRODUCTS & EQUIPMENTS" />
            <div className="container py-5">
                <h1 className="text-center" style={{ color: ThemeColors.textColor_fade }}>
                    DNS believes in sustainable and environmentally friendly products and below are some of the key products we utilise.
                </h1>
                <div className="products-container py-3">
                    {allProducts.map((product, index) => (
                        <ProductBox data={product} key={index} />
                    ))}
                </div>
                <AboutPageLine />
                <h1 className="text-center mt-5" style={{ color: ThemeColors.textColor_fade }}>
                    We utilise modern tools with an aim to maintain cost effective, hazard free, environment friendly services for our
                    clients
                </h1>
                <div className="equipments-container py-5">
                    {allEquipments.map((eqpmnt, index) => (
                        <EquipmentBox equipment={eqpmnt} setImgData={setShowImageData} key={index} />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default ProductsAndEquipment;
