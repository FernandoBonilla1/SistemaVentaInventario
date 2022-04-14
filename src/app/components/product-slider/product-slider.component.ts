import { Component, OnInit } from '@angular/core';
import SwiperCore, { Pagination, SwiperOptions } from 'swiper';

SwiperCore.use([Pagination])

@Component({
  selector: 'app-product-slider',
  templateUrl: './product-slider.component.html',
  styleUrls: ['./product-slider.component.css']
})
export class ProductSliderComponent implements OnInit {

  constructor() { }

  slides = [
    {
      producto: 'Taladro1',
      img: 'products/tools/5302498_01-Taladro.png',
      descripcion: 'Taladro percutor inalámbrico atornillador con velocidad ajustable, giro reversible, y más. Contiene kit de 29 accesorios.',
      precio: 89500,
      descuento: 0.1,
      new: true,
      marca_logo: 'brands/bauker.png',
      marca: 'Bauker'
    },
    {
      producto: 'Taladro2',
      img: 'products/tools/5302498_01-Taladro.png',
      descripcion: 'Taladro percutor inalámbrico atornillador con velocidad ajustable, giro reversible, y más. Contiene kit de 29 accesorios.',
      precio: 89500,
      descuento: 0.1,
      new: true,
      marca_logo: 'brands/bauker.png',
      marca: 'Bauker'
    },
    {
      producto: 'Taladro3',
      img: 'products/tools/5302498_01-Taladro.png',
      descripcion: 'Taladro percutor inalámbrico atornillador con velocidad ajustable, giro reversible, y más. Contiene kit de 29 accesorios.',
      precio: 89500,
      descuento: 0.1,
      new: true,
      marca_logo: 'brands/bauker.png',
      marca: 'Bauker'
    }
  ]

  config: SwiperOptions = {
    centeredSlides: true,
    slidesPerView: 1,
    pagination: {
      clickable: true,
      dynamicBullets: true,
      dynamicMainBullets: 1
    },
    breakpoints: {
      1140: {
        slidesPerView: 3
      }
    },
    grabCursor: true,
    freeMode: true,
    rewind: true,
    autoHeight: true,
    spaceBetween: 10,
    initialSlide: 1,
    slideToClickedSlide: true
  }

  ngOnInit(): void {
  }

}
