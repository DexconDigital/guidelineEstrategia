var app = {
    ajax: function (url, data, funcion) {
        $.ajax({
            url: url,
            type: 'POST',
            data: data,
            beforeSend: function (e) {
                console.log("enviando peticion");
            },
            error: function (error) {
                console.log("Error en la peticion");
            },
            success: function (respuesta) {
                funcion(respuesta);
            }
        });
    },

    ajaximg: function (url, data, funcion) {
        $.ajax({
            url: url,
            dataType: 'text',
            cache: false,
            contentType: false,
            processData: false,
            data: data,
            type: 'post',
            beforeSend: function (e) {
                console.log("enviando peticion");
                Swal.fire({
                    title: "Cargando...",
                    text: "Espera un momento",
                    showConfirmButton: false,
                    allowOutsideClick: false,
                });
            },
            error: function (error) {
                console.log("Error en la peticion");
            },
            success: function (respuesta) {
                funcion(respuesta);
            }
        });
    },

    mensaje: function (respuesta) {
        var divMensaje = $('#mensaje');
        var clase = (respuesta.codigo > 0) ? 'alert-success' : 'alert-danger';
        divMensaje.removeClass('alert-success');
        divMensaje.removeClass('alert-danger');
        divMensaje.removeClass('hidden');
        divMensaje.removeClass(clase);
        divMensaje.text(respuesta.mensaje);
        divMensaje.show();
        divMensaje.fadeOut(5000);
    },
    mensaje2: function (respuesta) {
        var divMensaje = $('#mensaje2');
        var clase = (respuesta.codigo > 0) ? 'alert-success' : 'alert-danger';
        divMensaje.removeClass('alert-success');
        divMensaje.removeClass('alert-danger');
        divMensaje.removeClass('hidden');
        divMensaje.removeClass(clase);
        divMensaje.text(respuesta.mensaje);
        divMensaje.show();
        divMensaje.fadeOut(5000);
    }
};
