# Pnumatic logic systems

- A pnumatic logic system can have tanks and valves that are represented by nodes
- these nodes are connected by edges / pipes
- this node - edge system can easily be represented with a graph data structure.

# Tanks
- a tank can have a capacity
- a tank can have stuff in it (liquid, gas, magic??)
- stuff / capacity is the pressure
- connected tanks seek to be equalized

# Valves
- a valve has two inputs and one output
- one input is the main input, which can flow through to the output
- the second input is the control input, which controls whether the main input can flow to the output
- a valve's default state can be either closed or open
- a valve will have a threshold control input amount
- a valve will have a control input cost
- when a valve gets a control input of the threshold amount, it will switch to the opposite of it's default state
- when a valve gets a control input, the valve will use up some amount of the input to maintain the state
- if a valve does not receive enough input, it will switch to it's default state
- a valve has a min and max bandwidth for flow
- a valve can have directed or omni directional flow (I should make valves directed first)
- a valve's flow could be analog, dependant on the proportion of input
- valves could have durability, which could impact how they work and when they break
