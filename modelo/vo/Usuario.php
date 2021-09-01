<?php

class Usuario {

    private $id_empresa;
    private $fecha;
    private $razon_social;
    private $nit;

    private $horizonte_inicial;
    private $horizonte_final;
    private $horizonte_noanios;
    private $estrategas;
    private $color;
    private $logo;

    //GET

    function getId_empresa() {
        return $this->id_empresa;
    }

    function getFecha() {
        return $this->fecha;
    }

    function getRazon_social() {
        return $this->razon_social;
    }

    function getNit() {
        return $this->nit;
    }

    function getHorizonte_inicial() {
        return $this->horizonte_inicial;
    }

    function getHorizonte_final() {
        return $this->horizonte_final;
    }

    function getHorizonte_noanios() {
        return $this->horizonte_noanios;
    }

    function getEstrategas() {
        return $this->estrategas;
    }

    function getColor() {
        return $this->color;
    }

    function getLogo() {
        return $this->logo;
    }

    //SET

    function setId_empresa( $id_empresa ) {
        $this->id_empresa = $id_empresa;
    }

    function setFecha( $fecha ) {
        $this->fecha = $fecha;
    }

    function setRazon_social( $razon_social ) {
        $this->razon_social = $razon_social;
    }

    function setNit( $nit ) {
        $this->nit = $nit;
    }

    function setHorizonte_inicial( $horizonte_inicial ) {
        $this->horizonte_inicial = $horizonte_inicial;
    }

    function setHorizonte_final( $horizonte_final ) {
        $this->horizonte_final = $horizonte_final;
    }

    function setHorizonte_noanios( $horizonte_noanios ) {
        $this->horizonte_noanios = $horizonte_noanios;
    }

    function setEstrategas( $estrategas ) {
        $this->estrategas = $estrategas;
    }

    function setColor( $color ) {
        $this->color = $color;
    }

    function setLogo( $logo ) {
        $this->logo = $logo;
    }
}
