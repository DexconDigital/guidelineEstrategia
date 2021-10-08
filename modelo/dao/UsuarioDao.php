<?php

class UsuarioDAO {

    /**
    * @var PDO
    */

    private $cnn;

    public function __construct( &$cnn ) {
        $this->cnn = $cnn;
    }

    public function validar( $clave ) {
        $sql = "SELECT usuario FROM  administradores WHERE clave=:clave";
        $sentencia = $this->cnn->prepare( $sql );
        $sentencia->execute( ['clave'=>$clave] );
        return $sentencia->fetch( PDO::FETCH_OBJ );
    }

    public function consultar( $razon_social, $nit ) {
        $sql = "SELECT * FROM  empresa WHERE razon_social=:razon_social AND nit=:nit";
        $sentencia = $this->cnn->prepare( $sql );
        $sentencia->execute( ['razon_social'=>$razon_social, 'nit'=>$nit] );
        return $sentencia->fetch( PDO::FETCH_OBJ );
    }

    public function insertar( Usuario $usuario ) {
        $sql = "INSERT INTO empresa (fecha, razon_social, nit) 
                VALUES (:fecha,:razon_social,:nit)";
        $sentencia = $this->cnn->prepare( $sql );
        $sentencia->execute( [
            'fecha' => $usuario->getFecha(),
            'razon_social' => $usuario->getRazon_social(),
            'nit' => $usuario->getNit()
        ] );
        return $this->cnn->lastInsertId();
    }

    public function consultar_datos( $id_empresa ) {
        $sql = "SELECT e.*, es.seguimientos FROM empresa e LEFT JOIN estrategias es ON e.id_empresa = es.id_empresa WHERE e.id_empresa=:id_empresa";
        $sentencia = $this->cnn->prepare( $sql );
        $sentencia->execute( ['id_empresa'=>$id_empresa] );
        return $sentencia->fetch( PDO::FETCH_OBJ );
    }
    
    public function crear_usuario( $usuario, $clave ) {
        $sql = "INSERT INTO administradores (usuario, clave) 
                VALUES (:usuario,:clave)";
        $sentencia = $this->cnn->prepare( $sql );
        $sentencia->execute( [
            'usuario' => $usuario,
            'clave' => $clave
        ] );
        return $this->cnn->lastInsertId();
    }
    
    public function consultar_usuarios() {
        $sql = "SELECT * FROM administradores";
        $sentencia = $this->cnn->prepare( $sql );
        $sentencia->execute();
        return $sentencia->fetchAll( PDO::FETCH_OBJ );
    }
    
    public function actualizar_usuario( $clave, $id ) {
        $sql = "UPDATE administradores SET clave=:clave WHERE id_admin=:id";
        $sentencia = $this->cnn->prepare( $sql );
        $sentencia->execute( [
            'clave' => $clave,
            'id' => $id
        ] );
        return $this->cnn->lastInsertId();
    }
    
    public function eliminar_usuario( $id ) {
        $sql = "DELETE FROM administradores WHERE id_admin=:id";
        $sentencia = $this->cnn->prepare( $sql );
        $sentencia->execute( [
            'id' => $id
        ] );
        return $this->cnn->lastInsertId();
    }

    public function modificar_empresa( Usuario $usuario ) {
        $sql = "UPDATE empresa SET nit=:nit, razon_social=:razon_social, fecha=:fecha, horizonte_inicial=:horizonte_inicial, horizonte_final=:horizonte_final, horizonte_noanios=:horizonte_noanios,
        estrategas=:estrategas, color=:color  WHERE id_empresa=:id_empresa";
        $sentencia = $this->cnn->prepare( $sql );
        $sentencia->execute( [
            'nit' => $usuario->getNit(),
            'razon_social' => $usuario->getRazon_social(),
            'fecha' => $usuario->getFecha(),
            'horizonte_inicial' => $usuario->getHorizonte_inicial(),
            'horizonte_final' => $usuario->getHorizonte_final(),
            'horizonte_noanios' => $usuario->getHorizonte_noanios(),
            'estrategas' => $usuario->getEstrategas(),
            'color' => $usuario->getColor(),
            'estrategas' => $usuario->getEstrategas(),
            'id_empresa' => $usuario->getId_empresa()
        ] );
        return $this->cnn->lastInsertId();
    }

    public function modificar_empresa_logo( Usuario $usuario ) {
        $sql = "UPDATE empresa SET nit=:nit, razon_social=:razon_social, fecha=:fecha, horizonte_inicial=:horizonte_inicial, horizonte_final=:horizonte_final, horizonte_noanios=:horizonte_noanios,
        estrategas=:estrategas, color=:color, logo=:logo  WHERE id_empresa=:id_empresa";
        $sentencia = $this->cnn->prepare( $sql );
        $sentencia->execute( [
            'nit' => $usuario->getNit(),
            'razon_social' => $usuario->getRazon_social(),
            'fecha' => $usuario->getFecha(),
            'horizonte_inicial' => $usuario->getHorizonte_inicial(),
            'horizonte_final' => $usuario->getHorizonte_final(),
            'horizonte_noanios' => $usuario->getHorizonte_noanios(),
            'estrategas' => $usuario->getEstrategas(),
            'color' => $usuario->getColor(),
            'estrategas' => $usuario->getEstrategas(),
            'logo' => $usuario->getLogo(),
            'id_empresa' => $usuario->getId_empresa()
        ] );
        return $this->cnn->lastInsertId();
    }

    public function agregar_axiologica( $id_empresa, $axiologica ) {
        $sql = "UPDATE empresa SET axiologica=:axiologica WHERE id_empresa=:id_empresa";
        $sentencia = $this->cnn->prepare( $sql );
        $sentencia->execute( [
            'axiologica' => $axiologica,
            'id_empresa' => $id_empresa
        ] );
        return $this->cnn->lastInsertId();
    }

    public function agregar_referencia( $id_empresa, $referencia ) {
        $sql = "UPDATE empresa SET referencia=:referencia WHERE id_empresa=:id_empresa";
        $sentencia = $this->cnn->prepare( $sql );
        $sentencia->execute( [
            'referencia' => $referencia,
            'id_empresa' => $id_empresa
        ] );
        return $this->cnn->lastInsertId();
    }

    public function agregar_principio( $id_empresa, $principio ) {
        $sql = "UPDATE empresa SET principio=:principio WHERE id_empresa=:id_empresa";
        $sentencia = $this->cnn->prepare( $sql );
        $sentencia->execute( [
            'principio' => $principio,
            'id_empresa' => $id_empresa
        ] );
        return $this->cnn->lastInsertId();
    }

    public function agregar_mision( $id_empresa, $mision_text ) {
        $sql = "UPDATE empresa SET mision=:mision WHERE id_empresa=:id_empresa";
        $sentencia = $this->cnn->prepare( $sql );
        $sentencia->execute( [
            'mision' => $mision_text,
            'id_empresa' => $id_empresa
        ] );
        return $this->cnn->lastInsertId();
    }

    public function agregar_vision( $id_empresa, $vision_text ) {
        $sql = "UPDATE empresa SET vision=:vision WHERE id_empresa=:id_empresa";
        $sentencia = $this->cnn->prepare( $sql );
        $sentencia->execute( [
            'vision' => $vision_text,
            'id_empresa' => $id_empresa
        ] );
        return $this->cnn->lastInsertId();
    }
    
    public function agregar_procesos( $id_empresa, $general ) {
        $sql = "UPDATE empresa SET procesos=:procesos WHERE id_empresa=:id_empresa";
        $sentencia = $this->cnn->prepare( $sql );
        $sentencia->execute( [
            'procesos' => $general,
            'id_empresa' => $id_empresa
        ] );
        return $this->cnn->lastInsertId();
    }

    public function consultar_dignostico( $id_empresa ) {
        $sql = "SELECT * FROM diagnostico WHERE id_empresa=:id_empresa";
        $sentencia = $this->cnn->prepare( $sql );
        $sentencia->execute( ['id_empresa'=>$id_empresa] );
        return $sentencia->fetch( PDO::FETCH_OBJ );
    }

    public function agregar_diagnostico( $id_empresa ) {
        $sql = "INSERT INTO diagnostico (id_empresa) 
                VALUES (:id_empresa)";
        $sentencia = $this->cnn->prepare( $sql );
        $sentencia->execute( [
            'id_empresa' => $id_empresa
        ] );
        return $this->cnn->lastInsertId();
    }

    public function agregar_pci( $id_empresa, $pci ) {
        $sql = "UPDATE diagnostico SET pci=:pci WHERE id_empresa=:id_empresa";
        $sentencia = $this->cnn->prepare( $sql );
        $sentencia->execute( [
            'pci' => $pci,
            'id_empresa' => $id_empresa
        ] );
        return $this->cnn->lastInsertId();
    }

    public function agregar_poam( $id_empresa, $general ) {
        $sql = "UPDATE diagnostico SET poam=:poam WHERE id_empresa=:id_empresa";
        $sentencia = $this->cnn->prepare( $sql );
        $sentencia->execute( [
            'poam' => $general,
            'id_empresa' => $id_empresa
        ] );
        return $this->cnn->lastInsertId();
    }

    public function agregar_dofa( $id_empresa, $dofa_text ) {
        $sql = "UPDATE diagnostico SET dofa=:dofa_text WHERE id_empresa=:id_empresa";
        $sentencia = $this->cnn->prepare( $sql );
        $sentencia->execute( [
            'dofa_text' => $dofa_text,
            'id_empresa' => $id_empresa
        ] );
        return $this->cnn->lastInsertId();
    }

    public function agregar_analisis( $id_empresa, $campos ) {
        $sql = "UPDATE diagnostico SET dofa_analisis=:campos WHERE id_empresa=:id_empresa";
        $sentencia = $this->cnn->prepare( $sql );
        $sentencia->execute( [
            'campos' => $campos,
            'id_empresa' => $id_empresa
        ] );
        return $this->cnn->lastInsertId();
    }

    public function consultar_estrategias( $id_empresa ) {
        $sql = "SELECT es.*, em.color FROM estrategias es INNER JOIN empresa em on es.id_empresa = em.id_empresa WHERE es.id_empresa=:id_empresa";
        $sentencia = $this->cnn->prepare( $sql );
        $sentencia->execute( ['id_empresa'=>$id_empresa] );
        return $sentencia->fetch( PDO::FETCH_OBJ );
    }

    public function agregar_estrategias( $id_empresa ) {
        $sql = "INSERT INTO estrategias (id_empresa) 
                VALUES (:id_empresa)";
        $sentencia = $this->cnn->prepare( $sql );
        $sentencia->execute( [
            'id_empresa' => $id_empresa
        ] );
        return $this->cnn->lastInsertId();
    }

    public function agregar_seguimientos( $id_empresa, $campos ) {
        $sql = "UPDATE estrategias SET seguimientos=:seguimientos WHERE id_empresa=:id_empresa";
        $sentencia = $this->cnn->prepare( $sql );
        $sentencia->execute( [
            'seguimientos' => $campos,
            'id_empresa' => $id_empresa
        ] );
        return $this->cnn->lastInsertId();
    }

    public function agregar_fuerzas( $id_empresa, $fuerzas ) {
        $sql = "UPDATE estrategias SET fuerzas=:fuerzas WHERE id_empresa=:id_empresa";
        $sentencia = $this->cnn->prepare( $sql );
        $sentencia->execute( [
            'fuerzas' => $fuerzas,
            'id_empresa' => $id_empresa
        ] );
        return $this->cnn->lastInsertId();
    }

    public function agregar_bcg( $id_empresa, $general ) {
        $sql = "UPDATE estrategias SET bcg=:general WHERE id_empresa=:id_empresa";
        $sentencia = $this->cnn->prepare( $sql );
        $sentencia->execute( [
            'general' => $general,
            'id_empresa' => $id_empresa
        ] );
        return $this->cnn->lastInsertId();
    }

    public function agregar_axiologica2( $id_empresa, $axiologica ) {
        $sql = "UPDATE estrategias SET axiologica=:axiologica WHERE id_empresa=:id_empresa";
        $sentencia = $this->cnn->prepare( $sql );
        $sentencia->execute( [
            'axiologica' => $axiologica,
            'id_empresa' => $id_empresa
        ] );
        return $this->cnn->lastInsertId();
    }

    public function agregar_referencia2( $id_empresa, $referencia ) {
        $sql = "UPDATE estrategias SET referencia=:referencia WHERE id_empresa=:id_empresa";
        $sentencia = $this->cnn->prepare( $sql );
        $sentencia->execute( [
            'referencia' => $referencia,
            'id_empresa' => $id_empresa
        ] );
        return $this->cnn->lastInsertId();
    }

    public function agregar_principio2( $id_empresa, $principio ) {
        $sql = "UPDATE estrategias SET principio=:principio WHERE id_empresa=:id_empresa";
        $sentencia = $this->cnn->prepare( $sql );
        $sentencia->execute( [
            'principio' => $principio,
            'id_empresa' => $id_empresa
        ] );
        return $this->cnn->lastInsertId();
    }

    public function agregar_general( $id_empresa, $general ) {
        $sql = "UPDATE estrategias SET general=:general WHERE id_empresa=:id_empresa";
        $sentencia = $this->cnn->prepare( $sql );
        $sentencia->execute( [
            'general' => $general,
            'id_empresa' => $id_empresa
        ] );
        return $this->cnn->lastInsertId();
    }

    public function agregar_cmifuturo( $id_empresa, $general ) {
        $sql = "UPDATE estrategias SET cmi_futuro=:general WHERE id_empresa=:id_empresa";
        $sentencia = $this->cnn->prepare( $sql );
        $sentencia->execute( [
            'general' => $general,
            'id_empresa' => $id_empresa
        ] );
        return $this->cnn->lastInsertId();
    }

    public function agregar_objetivos( $id_empresa, $general ) {
        $sql = "UPDATE estrategias SET cmi_objetivos=:general WHERE id_empresa=:id_empresa";
        $sentencia = $this->cnn->prepare( $sql );
        $sentencia->execute( [
            'general' => $general,
            'id_empresa' => $id_empresa
        ] );
        return $this->cnn->lastInsertId();
    }
    
    public function agregar_cmi( $id_empresa, $general ) {
        $sql = "UPDATE estrategias SET cmi=:general WHERE id_empresa=:id_empresa";
        $sentencia = $this->cnn->prepare( $sql );
        $sentencia->execute( [
            'general' => $general,
            'id_empresa' => $id_empresa
        ] );
        return $this->cnn->lastInsertId();
    }
}
