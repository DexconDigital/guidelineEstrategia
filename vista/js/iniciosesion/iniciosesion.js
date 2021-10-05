var inicioSesion = {
    constructor: function () {
        $('.loader').fadeOut();
        $('body').css('overflow', 'visible');
        $('#frm').on('submit', inicioSesion.validarinicio);
    },
    validarinicio: function (e) {
        e.preventDefault();
        var formulario = $('#frm');
        var nit = formulario.find('#nit').val();
        var razon_social = formulario.find('#razon_social').val();
        var fecha = formulario.find('#fecha').val();
        if (fecha == '') {
            app.mensaje({
                codigo: -1,
                mensaje: 'Debe ingresar la fecha diligencia'
            });
            return;
        }
        if (razon_social == '') {
            app.mensaje({
                codigo: -1,
                mensaje: 'Debe ingresar la razon social'
            });
            return;
        }
        if (nit == '') {
            app.mensaje({
                codigo: -1,
                mensaje: 'Debe ingresar el NIT'
            });
            return;
        }
        Swal.fire({
            icon: 'warning',
            title: "Ingrese la clave de seguridad",
            html: '<input type="password" id="clave" class="form-control">',
            showCancelButton: true,
            cancelButtonText: "Cancelar",
            cancelButtonColor: "#dc3545",
            confirmButtonColor: "#71c904",
            confirmButtonText: "Confirmar"
        }).then(function (result) {
            if (result.isConfirmed) {
                var clave = $('#clave').val();
                var data = {
                    'nit': nit,
                    'razon_social': razon_social,
                    'fecha': fecha,
                    'clave': clave,
                    'opcion': 'iniciarSesion'
                };
                app.ajax('../controlador/GestionUsuarioControlador.php?opcion=iniciarSesion', data, inicioSesion.repuestaInicio);
            }
        })
    },
    repuestaInicio: function (respuesta) {
        if (respuesta.codigo < 0) {
            app.mensaje(respuesta);
            return;
        } else if (respuesta.codigo == 2) {
            Swal.fire({
                title: "Creando usuario...",
                text: "Espera un momento",
                showConfirmButton: false,
                allowOutsideClick: false,
            });
            setTimeout(() => {
                location.href = "menu.php";
            }, 4000);
        } else if (respuesta.codigo == 3) {
            Swal.fire({
                icon: 'error',
                title: "Error",
                confirmButtonText: 'Confirmar',
                confirmButtonColor: "#dc3545",
                text: "Clave incorrecta",
            });
        } else if (respuesta.codigo == 4) {
            Swal.fire({
                icon: 'error',
                title: "Error",
                confirmButtonText: 'Confirmar',
                confirmButtonColor: "#dc3545",
                text: "Usuario sin permisos",
            });
        } else {
            const Toast = Swal.mixin({
                toast: true,
                position: 'top',
                showConfirmButton: false,
                timer: 1000,
                timerProgressBar: true,
                didOpen: (toast) => {
                    toast.addEventListener('mouseenter', Swal.stopTimer)
                    toast.addEventListener('mouseleave', Swal.resumeTimer)
                }
            })
            Toast.fire({
                icon: 'success',
                title: 'Bienvenido'
            }).then((result) => {
                if (result.dismiss === Swal.DismissReason.timer) {
                    location.href = "menu.php";
                }
            })
        }
    }
};
inicioSesion.constructor();
