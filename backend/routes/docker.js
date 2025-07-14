const express = require('express');
const Docker = require('dockerode');
const router = express.Router();

const docker = new Docker({ socketPath: '/var/run/docker.sock' });

// Get all containers
router.get('/containers', async (req, res) => {
  try {
    const containers = await docker.listContainers({ all: true });
    res.json(containers);
  } catch (error) {
    console.error('Docker containers error:', error.message);
    res.status(500).json({ error: 'Failed to get containers' });
  }
});

// Start container
router.post('/containers/:id/start', async (req, res) => {
  try {
    const container = docker.getContainer(req.params.id);
    await container.start();
    res.json({ message: 'Container started successfully' });
  } catch (error) {
    console.error('Docker container start error:', error.message);
    res.status(500).json({ error: 'Failed to start container' });
  }
});

// Stop container
router.post('/containers/:id/stop', async (req, res) => {
  try {
    const container = docker.getContainer(req.params.id);
    await container.stop();
    res.json({ message: 'Container stopped successfully' });
  } catch (error) {
    console.error('Docker container stop error:', error.message);
    res.status(500).json({ error: 'Failed to stop container' });
  }
});

// Restart container
router.post('/containers/:id/restart', async (req, res) => {
  try {
    const container = docker.getContainer(req.params.id);
    await container.restart();
    res.json({ message: 'Container restarted successfully' });
  } catch (error) {
    console.error('Docker container restart error:', error.message);
    res.status(500).json({ error: 'Failed to restart container' });
  }
});

// Remove container
router.delete('/containers/:id', async (req, res) => {
  try {
    const container = docker.getContainer(req.params.id);
    await container.remove({ force: true });
    res.json({ message: 'Container removed successfully' });
  } catch (error) {
    console.error('Docker container remove error:', error.message);
    res.status(500).json({ error: 'Failed to remove container' });
  }
});

// Get all images
router.get('/images', async (req, res) => {
  try {
    const images = await docker.listImages();
    res.json(images);
  } catch (error) {
    console.error('Docker images error:', error.message);
    res.status(500).json({ error: 'Failed to get images' });
  }
});

// Remove image
router.delete('/images/:id', async (req, res) => {
  try {
    console.log('Attempting to remove image:', req.params.id);
    const image = docker.getImage(req.params.id);
    
    // Try to remove the image with force flag to handle dependencies
    await image.remove({ force: true, noprune: false });
    res.json({ message: 'Image removed successfully' });
  } catch (error) {
    console.error('Docker image remove error:', error.message);
    
    // Provide more specific error messages
    if (error.statusCode === 409) {
      res.status(409).json({ 
        error: 'Cannot remove image - it is being used by a running container. Stop the container first.' 
      });
    } else if (error.statusCode === 404) {
      res.status(404).json({ 
        error: 'Image not found' 
      });
    } else {
      res.status(500).json({ 
        error: `Failed to remove image: ${error.message}` 
      });
    }
  }
});

// Pull image from Docker Hub
router.post('/images/pull', async (req, res) => {
  try {
    const { image, tag = 'latest' } = req.body;
    const fullImageName = `${image}:${tag}`;
    
    const stream = await docker.pull(fullImageName);
    
    // Stream the pull progress
    docker.modem.followProgress(stream, (err, result) => {
      if (err) {
        console.error('Pull error:', err);
        return res.status(500).json({ error: 'Failed to pull image' });
      }
      res.json({ message: 'Image pulled successfully', result });
    }, (progress) => {
      // You can emit progress via Socket.IO here
      console.log('Pull progress:', progress);
    });
    
  } catch (error) {
    console.error('Docker pull error:', error.message);
    res.status(500).json({ error: 'Failed to pull image' });
  }
});

// Get all networks
router.get('/networks', async (req, res) => {
  try {
    const networks = await docker.listNetworks();
    res.json(networks);
  } catch (error) {
    console.error('Docker networks error:', error.message);
    res.status(500).json({ error: 'Failed to get networks' });
  }
});

// Get all volumes
router.get('/volumes', async (req, res) => {
  try {
    const volumes = await docker.listVolumes();
    res.json(volumes);
  } catch (error) {
    console.error('Docker volumes error:', error.message);
    res.status(500).json({ error: 'Failed to get volumes' });
  }
});

module.exports = router;
