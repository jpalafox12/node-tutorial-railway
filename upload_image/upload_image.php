<?php
//include './conexion.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $id_image = $_POST['idImage'];
    $nom_image = $_POST['nomImage'];
    $image = $_POST['image'];

    $path = "img/$nom_image.png";
    $actual_path = "https://node-tutorial-railway-production.up.railway.app/upload_image/$path";

    // Verificar si el archivo existe y eliminarlo si es necesario
    if (file_exists($path)) {
        unlink($path);
    }

    // Guardar la nueva imagen
    file_put_contents($path, base64_decode($image));

    $message = 'Se agregó correctamente la imagen';

    $response = array(
        "message" => $message
    );

    $json_response = json_encode($response);

    header('Content-Type: application/json');

    echo $json_response;
}
?>
