package com.example.msinventario.Controller;
import com.example.msinventario.dto.ErrorResponseDto;
import com.example.msinventario.dto.ProductoDto;
import com.example.msinventario.dto.ProveedorDto;
import com.example.msinventario.Entity.Inventario;
import com.example.msinventario.Entity.InventarioDetalle;
import com.example.msinventario.feign.ProductoFeign;
import com.example.msinventario.feign.ProveedorFeign;
import com.example.msinventario.Service.InventarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/inventario")
public class InventarioController {

    @Autowired
    private InventarioService inventarioService;

    @Autowired
    private ProductoFeign productoFeign;

    @Autowired
    private ProveedorFeign proveedorFeign;

    @GetMapping
    public ResponseEntity<List<Inventario>> getAll() {
        return ResponseEntity.ok(inventarioService.list());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Inventario> getById(@PathVariable Integer id) {
        Optional<Inventario> inventario = inventarioService.findById(id);
        return inventario.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody Inventario inventario) {
        try {
            ProveedorDto proveedorDto = proveedorFeign.getById(inventario.getProveedorId()).getBody();

            if (proveedorDto == null || proveedorDto.getId() == null) {
                String errorMessage = "Error: Proveedor no encontrado.";
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ErrorResponseDto(errorMessage));
            }

            for (InventarioDetalle inventarioDetalle : inventario.getInventarioDetalle()) {
                ProductoDto productoDto = productoFeign.getById(inventarioDetalle.getProductoId()).getBody();

                if (productoDto == null || productoDto.getId() == null) {
                    String errorMessage = "Error: Producto no encontrado.";
                    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ErrorResponseDto(errorMessage));
                }
            }
        } catch (Exception e) {
            String errorMessage = "Error al comunicarse con el servicio de Proveedor o Producto.";
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ErrorResponseDto(errorMessage));
        }

        Inventario nuevoInventario = inventarioService.save(inventario);
        return ResponseEntity.ok(nuevoInventario);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Integer id, @RequestBody Inventario inventario) {
        Optional<Inventario> existingInventario = inventarioService.findById(id);
        if (existingInventario.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        inventario.setId(id);
        Inventario updatedInventario = inventarioService.save(inventario);
        return ResponseEntity.ok(updatedInventario);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable Integer id) {
        Optional<Inventario> existingInventario = inventarioService.findById(id);
        if (existingInventario.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        inventarioService.delete(id);
        return ResponseEntity.ok("Inventario eliminado correctamente.");
    }
}
