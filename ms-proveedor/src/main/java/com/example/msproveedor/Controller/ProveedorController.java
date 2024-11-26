package com.example.msproveedor.Controller;

import com.example.msproveedor.Entity.Proveedor; // Importa la entidad Proveedor
import com.example.msproveedor.Service.ProveedorService; // Importa el servicio ProveedorService
import org.springframework.beans.factory.annotation.Autowired; // Importa la anotación para inyección de dependencias
import org.springframework.http.ResponseEntity; // Importa la clase ResponseEntity
import org.springframework.web.bind.annotation.*; // Importa las anotaciones para definir controladores REST

import java.util.List; // Importa la clase List
import java.util.Optional; // Importa la clase Optional

@RestController // Indica que esta clase es un controlador REST
@RequestMapping("/proveedor") // Define la ruta base para las solicitudes a este controlador
public class ProveedorController {

    @Autowired
    private ProveedorService proveedorService; // Inyección del servicio de proveedores

    // Listar todos los proveedores
    @GetMapping
    public ResponseEntity<List<Proveedor>> list() {
        List<Proveedor> proveedores = proveedorService.list(); // Obtiene la lista de proveedores
        return ResponseEntity.ok(proveedores); // Retorna la lista en una respuesta 200 OK
    }

    // Guardar un nuevo proveedor
    @PostMapping
    public ResponseEntity<Proveedor> save(@RequestBody Proveedor proveedor) {
        Proveedor savedProveedor = proveedorService.save(proveedor); // Guarda el proveedor
        return ResponseEntity.ok(savedProveedor); // Retorna el proveedor guardado
    }

    // Actualizar los datos de un proveedor
    @PutMapping("/{id}") // El id del proveedor se pasa por la URL
    public ResponseEntity<Proveedor> update(@PathVariable Integer id, @RequestBody Proveedor proveedor) {
        // Verifica si el proveedor con el id especificado existe
        Optional<Proveedor> existingProveedor = proveedorService.findById(id);
        if (existingProveedor.isEmpty()) {
            return ResponseEntity.notFound().build(); // Retorna 404 si no se encuentra
        }

        proveedor.setId(id); // Asegúrate de que el id del proveedor sea el correcto
        Proveedor updatedProveedor = proveedorService.update(proveedor); // Actualiza el proveedor
        return ResponseEntity.ok(updatedProveedor); // Retorna el proveedor actualizado
    }

    // Obtener un proveedor por su ID
    @GetMapping("/{id}")
    public ResponseEntity<Proveedor> listById(@PathVariable Integer id) {
        Optional<Proveedor> proveedor = proveedorService.findById(id); // Busca el proveedor por ID
        return proveedor.map(ResponseEntity::ok) // Retorna 200 OK si se encuentra
                .orElseGet(() -> ResponseEntity.notFound().build()); // Retorna 404 Not Found si no se encuentra
    }

    // Eliminar un proveedor por su ID
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteById(@PathVariable Integer id) {
        proveedorService.deleteById(id); // Elimina el proveedor por ID
        return ResponseEntity.ok("Eliminación Correcta"); // Retorna un mensaje de éxito
    }
}
