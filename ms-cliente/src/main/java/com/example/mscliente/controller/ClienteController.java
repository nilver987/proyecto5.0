package com.example.mscliente.controller;

import com.example.mscliente.entity.Cliente;
import com.example.mscliente.service.ClienteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/cliente")
public class ClienteController {

    @Autowired
    private ClienteService clienteService;

    // Listar todos los clientes
    @GetMapping
    public ResponseEntity<List<Cliente>> list() {
        List<Cliente> clientes = clienteService.list();
        return ResponseEntity.ok(clientes);
    }

    // Guardar un nuevo cliente
    @PostMapping
    public ResponseEntity<Cliente> save(@RequestBody Cliente cliente) {
        Cliente savedCliente = clienteService.save(cliente);
        return ResponseEntity.ok(savedCliente);
    }

    // Actualizar los datos de un cliente
    @PutMapping("/{id}")
    public ResponseEntity<Cliente> update(@PathVariable Integer id, @RequestBody Cliente cliente) {
        Optional<Cliente> existingCliente = clienteService.findById(id);
        if (existingCliente.isEmpty()) {
            return ResponseEntity.notFound().build(); // Retorna 404 si no existe
        }

        cliente.setId(id); // Asigna el id correcto al objeto cliente
        Cliente updatedCliente = clienteService.update(cliente);
        return ResponseEntity.ok(updatedCliente); // Retorna el cliente actualizado
    }

    // Obtener un cliente por su ID
    @GetMapping("/{id}")
    public ResponseEntity<Cliente> listById(@PathVariable Integer id) {
        Optional<Cliente> cliente = clienteService.findById(id);
        return cliente.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Eliminar un cliente por su ID
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteById(@PathVariable Integer id) {
        clienteService.delete(id);
        return ResponseEntity.ok("Eliminación Correcta");
    }
}
