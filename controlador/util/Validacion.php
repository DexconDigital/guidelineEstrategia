<?php

class Validacion {

    /**
     * Verifiva que la informacion que escribe se recibe sea correcta
     * @param array $reglas Restricciones sobre los parametrso
     * @param array $info son los parametrsos $_POST o _$_GET
     */
    public static function validar(array $reglas, array $info) {
        foreach ($reglas as $parametro => $restriccion) {
            switch ($restriccion) {
                case 'obligatorio':
                    if (empty($info[$parametro])) {
                        throw new ValidacionExcepcion("el campo $parametro es obligatorio", -1);
                    }
                    break;
                case 'numero':
                    if (!is_int($info[$parametro])) {
                        throw new ValidacionExcepcion("el campo $parametro  debe ser un numero", -1);
                    }
                    break;
                case 'email':
                    if (filter_var($dato, FILTER_VALIDATE_EMAIL)) {
                        throw new ValidacionExcepcion("La dirrecin de correo $parametro es incorrecto", -1);
                    }
                    break;
                case 'fecha':
                    $valores = explode('/', $fecha);
                    if (count($valores) == 3 && checkdate($valores[1], $valores[0], $valores[2])) {
                        
                    } else {
                        throw new ValidacionExcepcion("La fecha  $parametro es incorrecta", -1);
                    }
                    break;
            }
        }
    }

}
