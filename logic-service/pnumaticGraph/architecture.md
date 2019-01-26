# Architecture of the Pnumatic Graph System (PGS)

## What is a PGS?
- is a graph, meaning that it is a set of nodes and edges
- nodes are things that do something, they could store fluids (tanks) or enable the flow of fluids to other nodes (valves)
- edges represent the connections between nodes. They are like pipes or tubes that connect things together.
- a PGS represents the flow of fluid from some set of inputs to some set of outputs.

## What could a PGS be used for?
- A PGS could be used to create logic gates. These could be used to create any computing system.
- In the context of Labyrinthus, a PGS could be used to manage sources of magic from a player or other sources.
  - for example, a projectile weapon could use earth magic and water magic to grow a wooden projectile. then fire and water magic could be used to fire the projectile with steam
  - a compressor could use water and air to lower the temp, and earth, air, or steam to create pressure.
  - mixers to create different kinds of magic (water + fire = steam, water + air = ice, water + earth = wood)

## How does a user define a PGS?
- A player could piece together parts like legos.
- In a virtual env, having smooth snap together building is nice
  - could use 3d voronoi diagrams to define interactivity bubbles.
- Final output would be a JSON file defining the nodes and edges, maybe store asthetic information separately

## How does a user use a PGS?
- A user would need to connect inputs and outputs to a PGS to use it
- Once connected, the user would determine inputs to send. maybe a device connected to fluid storage could start or stop flow on key press
  - these could be mechanical switches, which wouldn't require magic to activate.
- The output of a PGS would be used to power / fuel devices

## Magic combinations
- Water + Fire = steam
- Water + Air = ice
- Water + Earth = wood

## Machine / Device examples
- color display
  - r = fire, g = earth, b = water, a = air
  - could be put together to make pixels for a bigger display
- projectile weapons
  - projectiles could be fired using steam
- mixer
  - used to mix different magics together to make new magics
- compressor
  - uses ice to lower temp
  - could use steam, air, or earth to raise pressure
  - used to create solid forms of magic, which take up less space and could be used to make things
- decompressor
  - uses fire to raise temp
  - uses air to lower pressure
  - used to decompress solids

## How is a PGS processed?
- PGS should be processed server side in game to limit players taking advantage of systems
- PGS can be communicated as a JSON file to the server
- server could know player's stats and equipment and process whole system server side
- client could send key presses so that switches could be processed
- could use a program like websocketd to send the information to appropriate sub processes
  - https://github.com/joewalnes/websocketd
  - could write PGS processor in a very efficiant language
  - would be very easy to parallelize
