const Ease = require('pixi-ease')

const Plugin = require('./plugin')

module.exports = class Bounce extends Plugin
{
    /**
     * bounce on borders
     * NOTE: screenWidth, screenHeight, worldWidth, and worldHeight needs to be set for this to work properly
     * @param {Viewport} parent
     * @param {object} [options]
     * @param {number} [time=150] time in ms to finish bounce
     * @param {string|function} [ease='easeInOutSine'] ease function or name (see http://easings.net/ for supported names)
     */
    constructor(parent, options)
    {
        super(parent)
        options = options || {}
        this.time = options.time || 150
        this.ease = options.ease || 'easeInOutSine'
    }

    down()
    {
        this.toX = this.toY = null
    }

    up()
    {
        this.bounce()
    }

    update(elapsed)
    {
        this.bounce()
        if (this.toX)
        {
            if (this.toX.update(elapsed))
            {
                this.toX = null
            }
        }
        if (this.toY)
        {
            if (this.toY.update(elapsed))
            {
                this.toY = null
            }
        }
    }

    bounce()
    {
        const decelerate = this.parent.plugin('decelerate')
        if (this.parent.pointers.length === 0 && ((!this.toX || !this.toY) && (!decelerate.x || !decelerate.y)))
        {
            const oob = this.parent.OOB()
            const point = oob.cornerPoint
            if (!this.toX && !decelerate.x)
            {
                if (oob.left)
                {
                    this.toX = new Ease.to(this.parent.container, { x: 0 }, this.time, { ease: this.ease })
                }
                else if (oob.right)
                {
                    this.toX = new Ease.to(this.parent.container, { x: this.parent.container.x + point.x - this.parent.worldWidth }, this.time, { ease: this.ease })
                }
            }
            if (!this.toY && !decelerate.y)
            {
                if (oob.top)
                {
                    this.toY = new Ease.to(this.parent.container, { y: 0 }, this.time, { ease: this.ease })
                }
                else if (oob.bottom)
                {
                    this.toY = new Ease.to(this.parent.container, { y: this.parent.container.y + point.y - this.parent.worldHeight }, this.time, { ease: this.ease })
                }
            }
        }
    }

    reset()
    {
        this.toX = this.toY = null
    }
}