import { Abstract2dArt, classNames, declareModule, makeArtModule, React, SCALE_PIXELS } from '@collboard/modules-sdk';
import { Vector } from 'xyzt';
import { contributors, description, license, repository, version } from '../package.json';

export const SVG_PADDING = 10;
export const IS_NEAR_DISTANCE = 20;

export class CubeArt extends Abstract2dArt {
    // TODO: Some clear rules how to name serializeName and module names (+ adding scopes and versions there)
    // TODO: How to handle versioning in arts?
    public static serializeName = 'Cube';
    public static manifest = {
        name: '@hejny/cube-drawing/cube-art',
        contributors,
        description,
        license,
        repository,
        version,
    };

    public constructor(public color: string) {
        super();
    }

    public get topLeftCorner() {
        return Vector.fromObject(this.shift).subtract(this.size.half());
    }
    public get bottomRightCorner() {
        return Vector.fromObject(this.shift).add(this.size.half());
    }

    public get size() {
        return Vector.cube(SCALE_PIXELS.field);
    }

    public get acceptedAttributes() {
        return ['color'];
    }

    render(selected: boolean) {
        return (
            <div
                className={classNames('art', selected && 'selected')}
                style={{
                    position: 'absolute',
                    left: this.topLeftCorner.x - SVG_PADDING,
                    top: this.topLeftCorner.y - SVG_PADDING,
                }}
            >
                <svg
                    width={this.size.x + 2 * SVG_PADDING}
                    height={this.size.y + 2 * SVG_PADDING}
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <g>
                        <rect
                            x={SVG_PADDING}
                            y={SVG_PADDING}
                            width={this.size.x}
                            height={this.size.y}
                            fill={this.color}
                        />
                    </g>
                </svg>
            </div>
        );
    }
}

declareModule(makeArtModule(CubeArt));
